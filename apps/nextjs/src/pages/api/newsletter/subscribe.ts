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
    email: z.string().email("The email you provided is invalid."),
  });

  // Validate request body
  const response = schema.safeParse(req.body);
  if (!response.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid request body",
      details:
        response.error instanceof ZodError
          ? response.error.errors
          : "Unknown error",
    });
  }

  // Extract email from response body
  const { email } = response.data;

  try {
    // Check if email already exists
    const emailExists = !!(await prisma.newsletter.findFirst({
      where: { email },
    }));

    if (emailExists) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Conflict",
        details: "The provided email is already subscribed to the newsletter.",
      });
    }

    // Create new newsletter entry
    const newNewsletterEntry = await prisma.newsletter.create({
      data: { email },
    });

    // Return created entry
    return res.status(201).json(newNewsletterEntry);
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
