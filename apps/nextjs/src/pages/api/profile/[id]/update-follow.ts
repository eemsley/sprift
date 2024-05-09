// /api/profile/[id]/update

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Validate HTTP method
  if (req.method !== "PUT") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }

  // Validate request query for ID
  const { id } = req.query;

  const idSchema = z.string().nonempty("The user id cannot be empty.");
  const idValidationResponse = idSchema.safeParse(id);

  if (!idValidationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid user id",
      details:
        idValidationResponse.error instanceof ZodError
          ? idValidationResponse.error.errors
          : "Unknown error",
    });
  }

  // Validate request body (all profile inputs)
  const schema = z.object({
    targetUserId: z.string(),
  });

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
  const { targetUserId } = validationResponse.data;

  try {
    // Update the user profile
    const user = await prisma.user.findUnique({
      where: { externalId: id as string },
      include: { followers: true, following: true },
    });
    const targetUser = await prisma.user.findUnique({
      where: { externalId: targetUserId },
      include: { followers: true, following: true },
    });
    if (!user || !targetUser) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The user does not exist.",
      });
    }
    if (user.following.some((u) => u.externalId === targetUserId)) {
      //user is alredy following target, unfollow them
      console.log(user.externalId + " unfollows " + targetUser.externalId);
      await prisma.user.update({
        where: { externalId: id as string },
        data: {
          following: {
            disconnect: {
              externalId: targetUserId,
            },
          },
        },
      });
      await prisma.user.update({
        where: { externalId: targetUserId },
        data: {
          followers: {
            disconnect: {
              externalId: id as string,
            },
          },
        },
      });
    } else {
      //user is not following target, follow them
      console.log(user.externalId + " follows " + targetUser.externalId);
      await prisma.user.update({
        where: { externalId: id as string },
        data: {
          following: {
            connect: {
              externalId: targetUserId,
            },
          },
        },
      });
      await prisma.user.update({
        where: { externalId: targetUserId },
        data: {
          followers: {
            connect: {
              externalId: id as string,
            },
          },
        },
      });
      await prisma.notification.create({
        data: {
          message: `${user.username} followed you!`,
          notificationType: "FOLLOW",
          user: {
            connect: {
              externalId: targetUserId,
            },
          },
        },
      });
    }

    // Return the updated entry
    return res.status(200).json(targetUser);
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
