// /api/profile/all-profiles

import type { NextApiRequest, NextApiResponse } from "next";

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

  try {
    const allProfiles = await prisma.user.findMany();
    // Return created entry
    return res.status(201).json(parseUsersForClient(allProfiles));
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

type AllProfilesPrismaResponse = User[];

const parseUsersForClient = (profiles: AllProfilesPrismaResponse) => {
  return profiles.map((profile) => {
    return {
      id: profile.externalId,
      username: profile.username,
      profilePic: profile.profilePic,
      email: profile.email,
    };
  });
};
