// /api/order/[id]

import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { prisma } from "@spree/db";

import { type OrderListings, type PrismaOrder } from "../../cart/purchase";

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
  const idSchema = z.string().nonempty("The order id cannot be empty.");
  const validationResponse = idSchema.safeParse(id);

  if (!validationResponse.success) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Invalid order id",
      details:
        validationResponse.error instanceof ZodError
          ? validationResponse.error.errors
          : "Unknown error",
    });
  }

  try {
    // Check if order already exists
    const orderExists = !!(await prisma.order.findUnique({
      where: { id: id as string },
    }));

    if (!orderExists) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not Found",
        details: "The order with the provided id does not exist.",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: id as string },
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
                    seller: true,
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
