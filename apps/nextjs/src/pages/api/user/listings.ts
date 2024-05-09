// /api/user/listings

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
  ListingStatus,
  prisma,
  type Cart,
  type Dislike,
  type Like,
  type Listing,
  type User,
} from "@spree/db";

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

    const userListings = await prisma.listing.findMany({
      where: { sellerId: user.id, status: ListingStatus.STAGING },
      include: {
        likes: true,
        dislikes: true,
        cart: true,
        imagePaths: {
          orderBy: {
            path: "asc",
          },
          select: {
            path: true,
          },
        },
        seller: true,
      },
    });
    // Return created entry
    return res.status(201).json(parseListingsForClient(userListings));
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

type AllListingsPrismaResponse = (Listing & {
  likes: Like[];
  dislikes: Dislike[];
  imagePaths: { path: string }[];
  cart: Cart[];
  seller: User;
})[];

const parseListingsForClient = (listings: AllListingsPrismaResponse) => {
  return listings.map((listing) => ({
    id: listing.id,
    description: listing.description,
    price: listing.price,
    seller: listing.seller,
    sellerName:
      listing.seller.username === ""
        ? listing.seller.email.split("@")[0]
        : listing.seller.username,
    sellerProfilePicUrl: listing.seller.profilePic,
    // Remove later
    address: "123 Test Street",
    imagePaths: listing.imagePaths.map((image) => image.path),
    likes: listing.likes.length,
    dislikes: listing.dislikes.length,
    carts: listing.cart.length,
    size: listing.size,
  }));
};