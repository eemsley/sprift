// /api/message/all-messages-in-chat

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
  prisma,
  type Listing,
  type ListingImagePath,
  type Message,
  type User,
} from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  // Validate ids
  const schema = z.object({
    senderId: z.string(),
    recipientId: z.string(),
  });

  const validationResponse = schema.safeParse(
    req.query as Record<string, string>,
  );

  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid listing id",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  const { senderId, recipientId } = req.query;

  if (typeof senderId !== "string" || typeof recipientId !== "string") {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid sender or recipient id",
      details: "The provided sender or recipient id is not a string.",
    });
  }

  try {
    // Check if sender and recipient exist in parallel
    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({
        where: { externalId: senderId },
      }),
      prisma.user.findUnique({
        where: { externalId: recipientId },
      }),
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided sender or recipient does not exist.",
      });
    }

    const userMessages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [{ senderId: sender.id }, { recipientId: recipient.id }],
          },
          {
            AND: [{ senderId: recipient.id }, { recipientId: sender.id }],
          },
        ],
      },
      include: {
        sender: true,
        recipient: true,
        listing: {
          include: {
            imagePaths: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    // console.log(userMessages);

    if (userMessages.length === 0) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "No messages found between the users.",
      });
    }

    return res.status(200).json(parseMessagesForClient(userMessages));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
}

type MessagePrismaResponse = (Message & {
  sender: User;
  recipient: User;
  listing:
    | (Listing & {
        imagePaths: ListingImagePath[];
      })
    | null;
})[];

type MessageClientResponse = {
  id: string;
  senderExternalId: string;
  recipientExternalId: string;
  listingDescription: string | null;
  image: string | null;
  createdAt: Date;
  content: string;
}[];

const parseMessagesForClient = (
  messages: MessagePrismaResponse,
): MessageClientResponse => {
  return messages.map(
    ({ id, sender, recipient, listing, createdAt, content }) => {
      const image: string[] = [];

      if (listing && listing.imagePaths.length > 0 && listing.imagePaths[0]) {
        const targetImagePath = listing.imagePaths.find((path) =>
          path.path.endsWith("1"),
        );

        if (targetImagePath) {
          image.push(targetImagePath.path);
        }
      }

      return {
        id,
        senderExternalId: sender.externalId,
        recipientExternalId: recipient.externalId,
        listingDescription: listing ? listing.description : null,
        image: image[0] ? image[0] : null,
        createdAt,
        content,
      };
    },
  );
};
