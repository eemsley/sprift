// /api/profile/

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

  // // Check cache for key
  const cache = null || (await redis.get(`${env.NODE_ENV}:api/profile/${id}/`));

  if (cache !== null) {
    console.log("Profile -> Cache hit");
    return res.status(200).json(cache);
  }
  console.log("Profile -> Cache miss");

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { externalId: id as string },
      include: {
        following: true,
        followers: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The user with the provided id does not exist.",
      });
    }

    const profile = {
      username: user.username,
      profilePic: user.profilePic,
      bio: user.bio,
      notificationsEnabled: user.notificationsEnabled,
      following: user.following,
      followers: user.followers,
      numSales: user.numSales,
    };

    const parsedProfile = parseProfileForClient(
      profile as ProfilePrismaResponse,
    );

    // Set profile in cache
    await redis.setex(
      `${env.NODE_ENV}:api/profile/${id}/`,
      DEFAULT_CACHE_EXPIRATION,
      JSON.stringify(parsedProfile),
    );

    // Return created entry
    return res
      .status(200)
      .json(parseProfileForClient(profile as ProfilePrismaResponse));
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
