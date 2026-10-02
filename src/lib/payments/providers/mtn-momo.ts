import { isFapshiConfigured } from "../fapshi-client";
import type { PaymentProviderDescriptor } from "../types";

/**
 * MTN Mobile Money — routed through Fapshi (see `fapshi-client.ts`), which
 * fronts both MTN and Orange behind one hosted-checkout API. The network
 * choice happens on Fapshi's own payment page, not here — this descriptor
 * exists mainly for the checkout button label / CMS copy.
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
  isConfigured: isFapshiConfigured,
  cmsLabelMatch: "mtn",
  redirectProcessor: "mobile_money",
  momoNetwork: "MTN",
};
