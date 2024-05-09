// /api/user/[id]/purchases

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import {
  prisma,
  type Cart,
  type Dislike,
  type Like,
  type Listing,
  type Order,
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

    const orders = await prisma.order.findMany({
      where: {
        purchaserId: user.id,
      },
      include: {
        suborders: {
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
        },
      },
    });

    // Return billing details
    return res.status(200).json(parseOrderForClient(orders));
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

type PrismaOrderResponse = Order & {
  suborders: (SubOrder & {
    lines: (OrderLine & {
      listing: Listing & {
        cart: Cart[];
        likes: Like[];
        dislikes: Dislike[];
        imagePaths: { path: string }[];
        seller: User;
      };
    })[];
  })[];
};

const orderToListings = (order: PrismaOrderResponse): ListingType[] => {
  const listings: ListingType[] = [];
  for (const suborder of order.suborders) {
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
  }

  return listings;
};

type OrderStatusPrisma =
  | "REQUIRES_ACTION"
  | "FAILED"
  | "PROCESSING"
  | "SUCCEEDED"
  | "CANCELED"
  | "REQUIRES_PAYMENT_METHOD"
  | "REQUIRES_CONFIRMATION"
  | "REQUIRES_CAPTURE"
  | null;

// TODO: Add order status on order model and parse here
const parseOrderStatus = (
  _: OrderStatusPrisma,
): "Processing" | "Shipped" | "Delivered" => {
  return "Processing";
};

const parseOrderForClient = (orders: PrismaOrderResponse[]): OrderType[] => {
  return orders.map((order) => ({
    id: order.id,
    date: order.createdAt.toDateString(),
    price: Number(order.total),
    items: orderToListings(order),
    status: parseOrderStatus(order.paymentStatus),
  }));
};
