import { isMtnMomoConfigured } from "../mtn-momo-client";
import type { PaymentProviderDescriptor } from "../types";

/**
 * MTN Mobile Money — Collection API push payment ("Request to Pay").
 * No hosted checkout page exists for MTN; `createProviderCheckout` sends the
 * customer to our own `/checkout/momo-pending` page, which polls the
 * requesttopay status until the customer approves on their phone. See
 * `src/lib/payments/mtn-momo-client.ts` and `src/lib/payments/README.md`.
 */
export const mtnMomoProvider: PaymentProviderDescriptor = {
  method: "mtn_momo",
  kind: "redirect",
  defaultLabel: "MTN MoMo",
  recordsPaymentOnCreate: true,
  requiresTransactionReference: false,
  initialPaymentStatus: "requires_confirmation",
  resolveSettlementCurrency: () => "XAF",
  buildProviderPaymentId: ({ orderId }) => `momo_mtn:${orderId}`,
  isConfigured: isMtnMomoConfigured,
  cmsLabelMatch: "mtn",
  redirectProcessor: "mobile_money",
  momoNetwork: "MTN",
};
