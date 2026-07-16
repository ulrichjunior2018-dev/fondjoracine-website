import { env } from "@/config/env";

import type { PaymentProviderDescriptor } from "../types";

/** Manual Orange Money: customer pays then submits a transaction reference. */
export const orangeMoneyProvider: PaymentProviderDescriptor = {
  method: "orange_money",
  kind: "manual_reference",
  defaultLabel: "Orange Money",
  recordsPaymentOnCreate: true,
  requiresTransactionReference: true,
  initialPaymentStatus: "processing",
  resolveSettlementCurrency: () => "XAF",
  buildProviderPaymentId: ({ transactionReference }) =>
    `orange_money:${transactionReference ?? ""}`,
  isConfigured: () => Boolean(env.ORANGE_MONEY_NUMBER),
};
