/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /api/recommend/explore

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { ListingStatus, prisma } from "@spree/db";

import {
  recommendNativeSQL,
  type PrismaListingRaw,
} from "~/utils/api/recommend";
import {
  // DEFAULT_CACHE_EXPIRATION,
  DEFAULT_NUMBER_OF_LISTINGS_TAKE_VALUE_FOR_PAGINATION,
} from "~/utils/contants";

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
    filter: z.boolean(),
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
  const { clerkId, filter } = validationResponse.data;

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
    // Make native SQL query for recommendations
    const recomendationNativeSQLResult = await prisma.$queryRaw<
      PrismaListingRaw[]
    >(recommendNativeSQL(user.id));
    // Abstract ID for later
    const recomendationNativeSQLResultListingIds =
      recomendationNativeSQLResult.map(({ id }) => id);

    const listings = await prisma.listing.findMany({
      take: DEFAULT_NUMBER_OF_LISTINGS_TAKE_VALUE_FOR_PAGINATION,
      orderBy: [{ createdAt: "desc" }],
      where: {
        status: ListingStatus.STAGING,
        NOT: {
          sellerId: user.id,
        },
        id: {
          notIn: recomendationNativeSQLResultListingIds,
        },
      },
      // cursor: cursorListingId
      //   ? {
      //       id: cursorListingId,
      //     }
      //   : undefined,
      // skip: cursorListingId ? 1 : 0,
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

    const parseListingsForClient = (listings) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return listings.map((listing) => ({
        id: listing.id,
        description: listing.description,
        price: listing.price,
        seller: listing.seller,
        sellerName:
          listing.seller.username === ""
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              listing.seller.email.split("@")[0]
            : listing.seller.username,
        sellerProfilePicUrl: listing.seller.profilePic,
        // Remove later
        address: "123 Test Street",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        imagePaths: listing.imagePaths.map((image) => image.path),
        likes: listing.likes.length,
        dislikes: listing.dislikes.length,
        carts: listing.cart.length,
        size: listing.size,
        gender: listing.gender,
        clothingType: listing.listingType,
      }));
    };

    // Parse listings for client
    const parsedListings = [
      ...parsedNativeSQLQuery(recomendationNativeSQLResult),
      ...parseListingsForClient(listings),
    ].slice(0, 50);

    // Set recomendations in cache
    // await redis.setex(
    //   `${env.NODE_ENV}:recommend:${clerkId}`,
    //   DEFAULT_CACHE_EXPIRATION,
    //   JSON.stringify(parsedListings),
    // );

    // Return created entry

    let filteredListings = parsedListings;
    if (filter) {
      const userFilters: {
        gender: string;
        maxPrice: number;
        sizes: string[];
        types: string[];
      } = JSON.parse(user.filters);

      filteredListings = parsedListings.filter((listing) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          (userFilters.sizes.includes(listing.size) ||
            userFilters.sizes.length == 0) &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          (userFilters.types.includes(listing.clothingType) ||
            userFilters.types.length == 0) &&
          (userFilters.gender == listing.gender || userFilters.gender == "U") &&
          (listing.price as unknown as number) <= userFilters.maxPrice
        );
      });
    }

    return res.status(200).json({
      listings: filteredListings,
      cursorListingId: parsedListings[parsedListings.length - 1]?.id,
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

const parsedNativeSQLQuery = (
  recomendationNativeSQLResult: PrismaListingRaw[],
) =>
  recomendationNativeSQLResult.map((listing: PrismaListingRaw) => {
    const seller = {
      id: listing.sellerId,
      externalId: listing.sellerExternalId,
      externalAttributes: listing.sellerExternalAttributes,
      stripeCustomerId: listing.sellerStripeCustomerId,
      notificationsEnabled: Boolean(listing.sellerNotificationsEnabled),
      bio: listing.sellerBio,
      filters: listing.sellerFilters,
      email: listing.sellerEmail,
      numSales: listing.sellerNumSales,
      name: listing.sellerName,
      city: listing.sellerCity,
      country: listing.sellerCountry,
      phone: listing.sellerPhone,
      state: listing.sellerState,
      street1: listing.sellerStreet1,
      street2: listing.sellerStreet2,
      zip: listing.sellerZip,
      profilePic: listing.sellerProfilePicUrl,
    };

    const parseImagePaths = () => {
      return [...new Set(listing.imagePaths.split(","))].filter(
        (path) => path.length > 50,
      );
    };

    const listingParsed = {
      id: listing.id,
      description: listing.description,
      price: listing.price,
      seller,
      sellerName: seller.name,
      sellerProfilePicUrl: seller.profilePic,
      // Remove later
      address: "123 Test Street",
      imagePaths: parseImagePaths(),
      likes: Number(BigInt(listing.likes)),
      dislikes: Number(BigInt(listing.dislikes)),
      carts: Number(BigInt(listing.carts)),
      size: listing.size,
      gender: listing.gender,
      clothingType: listing.listingType,
    };

    return listingParsed;
  });
