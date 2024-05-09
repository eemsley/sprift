import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { type Stripe } from "stripe";

import { OrderPaymentStatus, prisma } from "@spree/db";

import { STRIPE_WEBHOOK_SECRET_KEY, stripe } from "~/services/stripe";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      code: 405,
      message: "Method not allowed",
      details: "The request method is not supported for this endpoint.",
    });
  }
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      STRIPE_WEBHOOK_SECRET_KEY,
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.created":
        handleCreatePaymentIntent(event);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event);
        break;
      case "payment_intent.failed":
        await handlePaymentIntentFailed(event);
        break;
      case "charge.succeeded":
        await handleChargeSucceeded(event);
        break;
      default:
      // Unexpected event type
    }

    // record the event in the database
    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000), // convert to milliseconds
        data: {
          object: event.data.object,
          previous_attributes: event.data.previous_attributes,
        },
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(err);
    return;
  }
}

const handleCreatePaymentIntent = (event: Stripe.Event) => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  console.log("CREATED PAYMENT INTENT");
  console.log("PAYMENT INTENT: ", paymentIntent.id);
};

const handlePaymentIntentFailed = async (event: Stripe.Event) => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log("FAILED PAYMENT INTENT");

  // Update order payment intent status to failed
  await prisma.order.update({
    where: { paymentIntent: paymentIntent.id },
    data: {
      paymentStatus: OrderPaymentStatus.FAILED,
    },
  });

  console.log(paymentIntent);
};

const handlePaymentIntentSucceeded = async (event: Stripe.Event) => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log("SUCCESFUL PAYMENT INTENT");
  console.log("PAYMENT INTENT: ", paymentIntent.id);

  // Update order payment intent status to completed
  await prisma.order.update({
    where: { paymentIntent: paymentIntent.id },
    data: {
      paymentStatus: OrderPaymentStatus.SUCCEEDED,
    },
  });
};

const handleChargeSucceeded = async (event: Stripe.Event) => {
  const successfulCharge = event.data.object as Stripe.Charge;

  console.log("SUCCESFUL CHARGE");
  console.log("PAYMENT INTENT: ", successfulCharge.payment_intent);

  // Update order payment intent status to completed
  await prisma.order.update({
    where: { paymentIntent: successfulCharge.payment_intent as string },
    data: {
      paymentStatus: OrderPaymentStatus.SUCCEEDED,
    },
  });
};
