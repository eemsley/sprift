// /api/user/listings

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma, type User } from "@spree/db";

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
    search: z.string(),
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

  const { search } = validationResponse.data;

  try {
    // Check if user and listing exists
    if (search == "") {
      return res.status(201).json([]);
    }

    const matchingProfiles = await prisma.user.findMany({
      where: {
        username: { contains: search },
      },
    });
    // Return created entry
    return res.status(201).json(parseUsersForClient(matchingProfiles));
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
