// /api/s3/profile/image/upload.ts

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
    newProfilePicUrl: z.string(),
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
  const { clerkId, newProfilePicUrl } = validationResponse.data;
  try {
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: { externalId: clerkId },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided user does not exist.",
      });
    }

    // Update profile pic
    const userProfileImage = await prisma.user.update({
      data: {
        profilePic: newProfilePicUrl,
      },
      where: {
        id: user.id,
      },
    });

    const profile = {
      username: user.username,
      profilePic: userProfileImage.profilePic,
      bio: user.bio,
      notificationsEnabled: user.notificationsEnabled,
      following: user.following,
      followers: user.followers,
      numSales: user.numSales,
    };

    const parsedProfile = parseProfileForClient(
      profile as ProfilePrismaResponse,
    );

    // Set profile pic in cache
    await redis.setex(
      `${env.NODE_ENV}:api/profile/${user.externalId}/`,
      DEFAULT_CACHE_EXPIRATION,
      JSON.stringify(parsedProfile),
    );

    // Return created entry
    return res.status(201).json(userProfileImage);
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

//just in case we need to parse in the future
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
