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
    notificationsEnabled: z.boolean(),
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
  const { notificationsEnabled } = validationResponse.data;

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

    const updatedProfile = await prisma.user.update({
      where: { externalId: id as string },
      data: {
        notificationsEnabled,
      },
    });

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
