import { env } from "@/config/env";

import type { PaymentProviderDescriptor } from "../types";

/** Hosted Stripe Checkout redirect. Settles in the storefront default currency. */
export const stripeProvider: PaymentProviderDescriptor = {
  method: "stripe",
  kind: "redirect",
  defaultLabel: "Card",
  recordsPaymentOnCreate: true,
  requiresTransactionReference: false,
  initialPaymentStatus: "requires_confirmation",
  resolveSettlementCurrency: (defaultCurrency) => defaultCurrency,
  buildProviderPaymentId: ({ orderId }) => `stripe_checkout:${orderId}`,
  isConfigured: () => Boolean(env.STRIPE_SECRET_KEY),
  redirectProcessor: "stripe",
};
