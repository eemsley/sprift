// /api/cart/remove

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
      console.log("user not found", clerkId);
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

    console.log(listing);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided listing does not exist.",
      });
    }

    const listingInCart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        listingId,
      },
    });

    if (!listingInCart) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The provided listing does not exist in your cart.",
      });
    }

    // Remove listing from cart
    const removeListing = await prisma.cart.delete({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listing.id,
        },
      },
    });

    // Return created entry
    return res.status(201).json(removeListing);
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
