import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError, z } from "zod";

import { ListingStatus, prisma } from "@spree/db";

import { createOrder } from "~/utils/stripe";
import { stripe } from "~/services/stripe";

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

    // Check listings are not in checkout
    for (const listingId of cart) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "Not Found",
          details: "The provided listing does not exist.",
        });
      }

      if (listing.status === "CHECKOUT") {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Conflict",
          details:
            'The listing "' + listing.description + '"is already in checkout.',
        });
      }
    }

    // Create order in DB
    const { order, totalPrice } = await createOrder(user.id, cart);

    let customerId = user.stripeCustomerId;

    // If user does not have a customer id, create it
    if (!customerId) {
      const customer = await stripe.customers.create();

      // Update stripeCustomerId on user record
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: customer.id,
        },
      });

      customerId = customer.id;
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customerId,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2022-11-15" },
    );

    // Update order with PaymentIntent
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentIntent: paymentIntent.id,
        total: totalPrice,
      },
    });

    // Update listings status to CHECKOUT
    await prisma.listing.updateMany({
      where: {
        id: {
          in: cart,
        },
      },
      data: {
        status: ListingStatus.CHECKOUT,
      },
    });

    return res.status(200).json({
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      paymentIntentClientSecret: paymentIntent.client_secret,
      orderId: order.id,
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
