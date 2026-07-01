import Stripe from "stripe";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let stripe: Stripe | null = null;

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError("INTERNAL", "Stripe secret key is not configured.", { expose: false });
  }

  stripe ??= new Stripe(env.STRIPE_SECRET_KEY, {
    appInfo: {
      name: "FONDJO RACINE",
    },
  });

  return stripe;
}
