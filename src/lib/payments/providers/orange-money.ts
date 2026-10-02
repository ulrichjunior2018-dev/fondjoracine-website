import { isFapshiConfigured } from "../fapshi-client";
import type { PaymentProviderDescriptor } from "../types";

/**
 * Orange Money — routed through Fapshi (see `fapshi-client.ts`), same as
 * MTN. One hosted link covers both networks; the network choice happens on
 * Fapshi's payment page.
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
  isConfigured: isFapshiConfigured,
  cmsLabelMatch: "orange",
  redirectProcessor: "mobile_money",
  momoNetwork: "ORANGE",
};
