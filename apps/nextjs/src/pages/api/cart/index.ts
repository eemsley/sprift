// /api/cart/

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

    const listingsInCart = await prisma.cart.findMany({
      where: { userId: user.id },
    });

    const listingInCartIds = listingsInCart.map(({ listingId }) => listingId);
    const listings = await prisma.listing.findMany({
      where: {
        AND: [
          {
            id: {
              in: listingInCartIds,
            },
          },
          {
            OR: [
              { status: ListingStatus.STAGING },
              { status: ListingStatus.CHECKOUT },
            ],
          },
        ],
      },
      include: {
        imagePaths: true,
        seller: true,
      },
    });

    const cartFilteredForClient = listings.map((listing) => ({
      id: listing.id,
      sellerName: listing.seller.email.split("@")[0],
      sellerId: listing.seller.externalId,
      description: listing.description,
      price: listing.price.toNumber(),
      uri: listing.imagePaths[0]?.path,
    }));

    // Return created entry
    return res.status(201).json(cartFilteredForClient);
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
