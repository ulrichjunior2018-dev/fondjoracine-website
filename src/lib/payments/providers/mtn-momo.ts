import { env } from "@/config/env";

import type { PaymentProviderDescriptor } from "../types";

/** Manual MTN Mobile Money: customer pays then submits a transaction reference. */
export const mtnMomoProvider: PaymentProviderDescriptor = {
  method: "mtn_momo",
  kind: "manual_reference",
  defaultLabel: "MTN MoMo",
  recordsPaymentOnCreate: true,
  requiresTransactionReference: true,
  initialPaymentStatus: "processing",
  resolveSettlementCurrency: () => "XAF",
  buildProviderPaymentId: ({ transactionReference }) => `mtn_momo:${transactionReference ?? ""}`,
  isConfigured: () => Boolean(env.MTN_MOMO_NUMBER),
};
