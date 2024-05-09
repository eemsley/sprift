// /api/profile/

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

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

    const filters: string = user.filters;

    // Return created entry
    return res.status(200).json(JSON.parse(filters));
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
