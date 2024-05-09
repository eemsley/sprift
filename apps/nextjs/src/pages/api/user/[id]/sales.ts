// /api/user/[id]/sales

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
  prisma,
  type Cart,
  type Dislike,
  type Like,
  type Listing,
  type OrderLine,
  type SubOrder,
  type User,
} from "@spree/db";
import {
  type ListingType,
  type OrderType,
} from "@spree/expo/src/utils/mockData";

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
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided user does not exist.",
      });
    }

    const suborders = await prisma.subOrder.findMany({
      where: {
        sellerId: user.id,
      },
      include: {
        lines: {
          include: {
            listing: {
              include: {
                imagePaths: true,
                likes: true,
                dislikes: true,
                cart: true,
                seller: true,
              },
            },
          },
        },
      },
    });

    // Return billing details
    return res.status(200).json(parseSubordersForClient(suborders));
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

type PrismaSuborderResponse = SubOrder & {
  lines: (OrderLine & {
    listing: Listing & {
      cart: Cart[];
      likes: Like[];
      dislikes: Dislike[];
      imagePaths: { path: string }[];
      seller: User;
    };
  })[];
};

const suborderToListings = (
  suborder: PrismaSuborderResponse,
): ListingType[] => {
  const listings: ListingType[] = [];
  for (const { listing } of suborder.lines) {
    listings.push({
      id: listing.id,
      description: listing.description,
      price: Number(listing.price),
      sellerName: listing.seller.email.split("@")[0] as string,
      seller: listing.seller,
      sellerProfilePicUrl: listing.seller.profilePic,
      address: listing.seller.street1,
      imagePaths: listing.imagePaths.map(({ path }) => path),
      likes: listing.likes.length,
      dislikes: listing.dislikes.length,
      carts: listing.cart.length,
      size: listing.size,
      gender: listing.gender,
      clothingType: listing.listingType,
    });
  }

  return listings;
};

const calculateSuborderPrice = (suborder: PrismaSuborderResponse): number => {
  let total = 0;
  for (const { listing } of suborder.lines) {
    total += Number(listing.price);
  }
  return total;
};

const parseSubordersForClient = (
  suborders: PrismaSuborderResponse[],
): OrderType[] => {
  return suborders.map((suborder) => ({
    id: suborder.id,
    date: suborder.createdAt.toDateString(),
    price: calculateSuborderPrice(suborder),
    items: suborderToListings(suborder),
    status: "Processing",
  }));
};
