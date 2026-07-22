import type { PaymentProviderDescriptor } from "../types";

/**
 * MTN Mobile Money — reserved for a future hosted-checkout provider.
 * Shown as “Soon” on checkout until `isConfigured` returns true and a
 * `redirectProcessor: "mobile_money"` adapter is wired in the order service.
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
  isConfigured: () => false,
  cmsLabelMatch: "mtn",
  redirectProcessor: "mobile_money",
  momoNetwork: "MTN",
};
