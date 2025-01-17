import Stripe from "stripe";

import { env } from "~/env.mjs";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
export const { STRIPE_WEBHOOK_SECRET_KEY } = env;
