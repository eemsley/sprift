// /api/listings/[id]

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
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
  const idSchema = z.string().nonempty("The listing id cannot be empty.");
  const validationResponse = idSchema.safeParse(id);

  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid listing id",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  try {
    // Check if listing already exists
    const listingExists = !!(await prisma.listing.findUnique({
      where: { id: id as string },
    }));

    if (!listingExists) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The listing with the provided id does not exist.",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: id as string },
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
        seller: {
          select: {
            username: true,
            email: true,
            externalId: true,
            profilePic: true,
          },
        },
      },
    });

    // Return created entry
    return res
      .status(201)
      .json(parseListingsForClient(listing as ListingPrismaResponse));
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

type ListingPrismaResponse = Listing & {
  likes: Like[];
  dislikes: Dislike[];
  imagePaths: { path: string }[];
  cart: Cart[];
  seller: User;
};

const parseListingsForClient = (listing: ListingPrismaResponse) => {
  return {
    id: listing.id,
    description: listing.description,
    price: listing.price,
    seller: listing.seller,
    imagePaths: listing.imagePaths.map((path) => path.path),
    likes: listing.likes.length,
    dislikes: listing.dislikes.length,
    carts: listing.cart.length,
    size: listing.size,
  };
};
