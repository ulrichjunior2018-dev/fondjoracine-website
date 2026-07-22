import type { PaymentProviderDescriptor } from "../types";

/**
 * Orange Money — reserved for a future hosted-checkout provider.
 * Shown as “Soon” on checkout until `isConfigured` returns true and a
 * `redirectProcessor: "mobile_money"` adapter is wired in the order service.
 */
export const orangeMoneyProvider: PaymentProviderDescriptor = {
  method: "orange_money",
  kind: "redirect",
  defaultLabel: "Orange Money",
  recordsPaymentOnCreate: true,
  requiresTransactionReference: false,
  initialPaymentStatus: "requires_confirmation",
  resolveSettlementCurrency: () => "XAF",
  buildProviderPaymentId: ({ orderId }) => `momo_orange:${orderId}`,
  isConfigured: () => false,
  cmsLabelMatch: "orange",
  redirectProcessor: "mobile_money",
  momoNetwork: "ORANGE",
};
