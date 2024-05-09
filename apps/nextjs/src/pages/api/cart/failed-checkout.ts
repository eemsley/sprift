// /api/cart/failed-checkout

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
    cart: z.string().array(),
  });

  // Validate request body
  const response = schema.safeParse(req.body);
  if (!response.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid request body",
      details:
        response.error instanceof ZodError
          ? response.error.errors
          : "Unknown error",
    });
  }

  // Extract listings from response body
  const { clerkId, cart } = response.data;

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

    // Update listings in cart status to STAGING
    await prisma.listing.updateMany({
        where: {
            id: {
                in: cart
            }
        },
        data: {
            status: "STAGING"
        }
    });

    return res.status(200).json({
        status: "success",
        code: 200,
        message: "OK",
        details: "Listings updated to STAGING",
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