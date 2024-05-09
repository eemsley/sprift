// /api/listings/like/remove

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
  const { listingId, clerkId } = validationResponse.data;

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

    const listing = await prisma.listing.findFirst({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided listing does not exist.",
      });
    }

    const likedListing = await prisma.like.findFirst({
      where: {
        userId: user.id,
        listingId,
      },
    });

    if (!likedListing) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "You have not liked the provided listing.",
      });
    }

    // Remove listing from l
    const removeLike = await prisma.like.delete({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listing.id,
        },
      },
    });

    // Return created entry
    return res.status(202).json(removeLike);
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
