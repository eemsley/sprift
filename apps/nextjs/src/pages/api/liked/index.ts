// /api/liked

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { ListingStatus, prisma } from "@spree/db";

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

  const { clerkId } = validationResponse.data;

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

    // Fetch all liked entries
    const likedListings = await prisma.like.findMany({
      where: {
        userId: user.id,
      },
    });

    const likedListingsIds = likedListings.map(({ listingId }) => listingId);

    const listings = await prisma.listing.findMany({
      where: {
        AND: [
          {
            id: {
              in: likedListingsIds,
            },
          },
          {
            status: ListingStatus.STAGING,
          },
        ],
      },
      include: {
        imagePaths: {
          orderBy: {
            path: "asc",
          },
        },
        seller: true,
      },
    });

    const listingsFilteredForClient = listings.map((listing) => ({
      // Change name later
      id: listing.id,
      sellerName: user.email.split("@")[0],
      description: listing.description,
      imagePaths: listing.imagePaths.map((image) => image.path),
      size: listing.size,
      price: listing.price,
    }));

    // Return created entry
    return res.status(201).json(listingsFilteredForClient);
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
