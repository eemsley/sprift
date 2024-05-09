// /api/message/create

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  const schema = z.object({
    clerkId: z.string(),
    recipientId: z.string(),
    content: z.string(),
    listingId: z.string().optional(),
  });

  // Validate request body
  const validationResponse = schema.safeParse(req.body);
  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid request body",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  // Extract data from response body
  const { clerkId, recipientId, content, listingId } = validationResponse.data;

  try {
    // Check if sender and recipient exist in parallel
    const [sender, recipient, listing] = await Promise.all([
      prisma.user.findUnique({
        where: { externalId: clerkId },
      }),
      prisma.user.findUnique({
        where: { externalId: recipientId },
      }),
      listingId
        ? prisma.listing.findUnique({
            where: { id: listingId },
          })
        : null,
    ]);

    if (!sender || !recipient || (listingId && !listing)) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided sender, recipient, or listing does not exist.",
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        sender: {
          connect: { externalId: clerkId },
        },
        recipient: {
          connect: { externalId: recipientId },
        },
        content,
        listing: listing // Connect the message to the listing if it exists
          ? {
              connect: { id: listing.id },
            }
          : undefined,
      },
    });
    await prisma.notification.create({
      data: {
        message: `Message from ${sender.username}! \n"${content}"`,
        notificationType: "CHAT",
        user: {
          connect: {
            externalId: recipientId,
          },
        },
      },
    });
    // Return created entry
    return res.status(201).json(newMessage);
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
      details: "An unexpected error occurred.",
    });
  }
}
