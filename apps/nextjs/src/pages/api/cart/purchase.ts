// /api/cart/purchase

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
  ListingStatus,
  prisma,
  type Cart,
  type Dislike,
  type Like,
  type Listing,
  type Order,
} from "@spree/db";

import { sendConfirmationEmailsOnOrderSuccess } from "~/utils/email/shipping";

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
    paymentIntent: z.string(),
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
  const { clerkId, paymentIntent } = validationResponse.data;

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

    // Get all the current listings in the user's cart
    const listingsInCart = (
      await prisma.cart.findMany({
        where: { userId: user.id },
        include: {
          listing: true,
        },
      })
    ).map((cart) => cart.listing);

    if (!listingsInCart || listingsInCart.length === 0) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "There are no listings in the users cart.",
      });
    }

    // Get all the ids of the listings in cart
    const listingIds: string[] = listingsInCart.map((listing) => listing.id);

    // Update listings to sold
    await prisma.listing.updateMany({
      where: {
        id: {
          in: listingIds,
        },
      },
      data: {
        status: ListingStatus.SOLD,
      },
    });

    // Delete from cart
    await prisma.cart.deleteMany({
      where: {
        AND: {
          userId: user.id,
          listingId: {
            in: listingIds,
          },
        },
      },
    });

    // Create order in DB
    const order = await prisma.order.findUnique({
      where: {
        paymentIntent,
      },
      include: {
        suborders: {
          include: {
            lines: {
              include: {
                listing: {
                  include: {
                    likes: true,
                    dislikes: true,
                    cart: true,
                    imagePaths: {
                      select: {
                        path: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order || !order.suborders) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The order has not been found.",
      });
    }

    const getOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        suborders: true,
      },
    });

    if (!getOrder) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The order has not been found.",
      });
    }

    // Send confirmation email to buyer and sellers
    await sendConfirmationEmailsOnOrderSuccess(user.id, order.id);

    // Parse listings to be in an array from order
    const listings: OrderListings[] = [];
    for (const suborder of order.suborders) {
      for (const line of suborder.lines) {
        if (line.listing) {
          listings.push(line.listing);
        }
      }
    }

    const parsedOrder: PrismaOrder = {
      ...order,
      listings,
    };

    // Return created entry
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          message:
            "Your order has been placed! Check your email for shipping details!",
          notificationType: "PURCHASE",
        },
        ...listings.map((listing) => ({
          userId: listing.sellerId,
          message: `Your listing has been sold! \n\"${listing.description.substring(
            0,
            20,
          )}...\" \nwas purchased by ${
            user.username
          }. Check your email for shipping instructions!`,
          notificationType: "PURCHASE",
        })),
      ],
      skipDuplicates: true,
    });
    return res.status(201).json(parsedOrder);
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

export type OrderListings = Listing & {
  cart: Cart[];
  likes: Like[];
  dislikes: Dislike[];
  imagePaths: {
    path: string;
  }[];
};

export type PrismaOrder = Order & {
  listings: OrderListings[];
};
