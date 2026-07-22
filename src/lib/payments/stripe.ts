import Stripe from "stripe";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let stripe: Stripe | null = null;

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError(
      "BAD_REQUEST",
      "Card payment is not configured. Set STRIPE_SECRET_KEY in Vercel Production and redeploy.",
    );
  }

  stripe ??= new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
      name: "Maison Fondjo",
    },
  });

  return stripe;
}
