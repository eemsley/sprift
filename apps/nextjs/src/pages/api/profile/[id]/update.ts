// /api/profile/[id]/update

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

import { DEFAULT_CACHE_EXPIRATION } from "~/utils/contants";
import { env } from "~/env.mjs";
import { redis } from "~/services/redis";

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
    username: z.string(),
    bio: z.string(),
    profilePic: z.string(),
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
  const { username, bio, profilePic } = validationResponse.data;

  try {
    // Update the user profile
    const user = await prisma.user.findUnique({
      where: { externalId: id as string },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The user does not exist.",
      });
    }
    if (username != user.username) {
      const existingUser = await prisma.user.findFirst({
        where: { username },
      });

      if (existingUser) {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Conflict",
          details: "The username is already taken.",
        });
      }
    }
    console.log(bio);

    const updatedProfile = await prisma.user.update({
      where: { externalId: id as string },
      data: {
        username,
        bio,
        profilePic,
      },
      include: {
        following: true,
        followers: true,
      },
    });

    // Update cache
    await redis.setex(
      `${env.NODE_ENV}:api/profile/${id}/`,
      DEFAULT_CACHE_EXPIRATION,
      JSON.stringify(parseProfileForClient(updatedProfile)),
    );

    // Return the updated entry
    return res.status(200).json(updatedProfile);
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

type ProfilePrismaResponse = {
  username: string;
  bio: string;
  profilePic: string;
  notificationsEnabled: boolean;
  following: object[];
  followers: object[];
  numSales: number;
};

const parseProfileForClient = (profile: ProfilePrismaResponse) => {
  return {
    bio: profile.bio,
    profilePic: profile.profilePic,
    username: profile.username,
    notificationsEnabled: profile.notificationsEnabled,
    following: profile.following,
    followers: profile.followers,
    numSales: profile.numSales,
  };
};
