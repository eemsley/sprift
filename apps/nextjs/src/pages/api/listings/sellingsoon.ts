// /api/recommend/

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

// import { env } from "~/env.mjs";
// import { redis } from "~/services/redis";

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

  // Get current user ID from body
  const { clerkId } = validationResponse.data;

  // Throw error if user is not authenticated
  if (!clerkId) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unauthorized",
      details: "The user is not authenticated.",
    });
  }

  // Check if user and listing exists
  const user = await prisma.user.findUnique({
    where: { externalId: clerkId },
    //include following
    include: {
      following: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Not Found",
      details: "The provided user does not exist.",
    });
  }

  // // Check cache for key
  // const cache =
  //   null || (await redis.get(`${env.NODE_ENV}:recommend:${clerkId}`));

  // if (cache !== null) {
  //   console.log("Recommendations -> Cache hit");
  //   return res.status(200).json(cache);
  // }
  // console.log("Recommendations -> Cache miss");

  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: ListingStatus.STAGING,

        NOT: {
          sellerId: user.id,
        },
      },
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
      //order by likes
      orderBy: [
        {
          cart: {
            _count: "desc",
          },
        },
      ],
    });

    const parsedListings = parseListingsForClient(listings);

    return res.status(200).json({
      listings: parsedListings,
      cursorListingId: listings[listings.length - 1]?.id,
    });
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

export interface ListingType {
  id: string;
  description: string;
  price: number;
  sellerName: string;
  sellerProfilePicUrl: string;
  address: string;
  imagePaths: string[];
  likes: number;
  dislikes: number;
  carts: number;
  size: string;
}

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
    gender: listing.gender,
    clothingType: listing.listingType,
  }));
};
