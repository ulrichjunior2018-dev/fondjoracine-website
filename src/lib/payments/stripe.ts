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

/**
 * Guards against the classic Stripe config mistake: pasting a Product ID
 * (`prod_...`) where a Price ID (`price_...`) is required. `line_items[].price`
 * silently rejects anything else at request time with an opaque "No such
 * price" error — this fails fast with an actionable message instead, scoped
 * to the checkout call path only (does not block app boot / unrelated routes).
 */
/** Client-safe flag — never exposes the price ID itself, only whether one is set. */
export function isElixirSubscriptionConfigured(): boolean {
  return Boolean(env.STRIPE_HAIR_ELIXIR_SUBSCRIPTION_PRICE_ID);
}

export function assertStripePriceId(value: string, envVarName: string): void {
  if (value && !value.startsWith("price_")) {
    throw new AppError(
      "BAD_REQUEST",
      `${envVarName} is set to "${value}", which looks like a Stripe Product ID, not a Price ID. ` +
        `Use the Price ID (starts with "price_") from that product's pricing table in Vercel ${envVarName}, then redeploy.`,
    );
  }
}
