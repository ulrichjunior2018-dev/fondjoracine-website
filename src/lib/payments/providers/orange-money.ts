import { isOrangeMoneyConfigured } from "../orange-money-client";
import type { PaymentProviderDescriptor } from "../types";

/**
 * Orange Money — Web Payment API hosted redirect. Unlike MTN, Orange returns
 * a real `payment_url`; `createProviderCheckout` sends the customer there
 * directly. See `src/lib/payments/orange-money-client.ts`.
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
  isConfigured: isOrangeMoneyConfigured,
  cmsLabelMatch: "orange",
  redirectProcessor: "mobile_money",
  momoNetwork: "ORANGE",
};
