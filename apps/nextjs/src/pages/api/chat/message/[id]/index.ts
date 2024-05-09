// /api/listings/[id]

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma, type User } from "@spree/db";

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

  const { id } = req.query;

  // Validate id
  const idSchema = z.string().nonempty("The user id cannot be empty.");
  const validationResponse = idSchema.safeParse(id);

  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid user id",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  try {
    // Check if listing already exists
    const user = await prisma.user.findUnique({
      where: { externalId: id as string },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The user with the provided id does not exist.",
      });
    }

    // Query unique chats
    const userChats = await prisma.user.findMany({
      where: {
        OR: [
          {
            sentMessages: {
              some: {
                recipientId: user.id,
              },
            },
          },
          {
            receivedMessages: {
              some: {
                senderId: user.id,
              },
            },
          },
        ],
      },
      include: {
        sentMessages: {
          include: {
            sender: true,
            recipient: true,
          },
        },
        receivedMessages: {
          include: {
            sender: true,
            recipient: true,
          },
        },
      },
    });

    // Return created entry
    return res.status(200).json(parseUsersForClient(userChats));
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

type UserPrismaResponse = User[];

type UserClientResponse = {
  externalId: string;
  username: string;
}[];

const parseUsersForClient = (
  userChats: UserPrismaResponse
  ): UserClientResponse => {
  return userChats.map(({ externalId, username }) => {
    return {
      externalId,
      username,
    };
  });
};
