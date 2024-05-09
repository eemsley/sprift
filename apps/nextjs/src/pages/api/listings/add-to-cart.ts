// /api/listings/add-to-cart

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
    clerkId: z.string(),
    listingId: z.string(),
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
  const { clerkId, listingId } = validationResponse.data;

  // Throw error if user is not authenticated
  if (!clerkId) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
      details: "The user is not authenticated.",
    });
  }

  try {
    // Check if user and listing exists
    const user = await prisma.user.findUnique({
      where: { externalId: clerkId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided user does not exist.",
      });
    }

    // Check if listing exists
    const listingExists = await prisma.listing.findFirst({
      where: { id: listingId },
    });

    if (!listingExists) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Listing not found",
        details: "The provided listing does not exist.",
      });
    }

    // Create new cart entry
    const cartListing = await prisma.cart.create({
      data: {
        user: {
          connect: { id: user.id }, // Connecting by user ID
        },
        listing: {
          connect: { id: listingId },
        },
      },
    });

    // Return created entry
    return res.status(201).json(cartListing);
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
