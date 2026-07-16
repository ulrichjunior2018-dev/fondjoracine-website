import { env } from "@/config/env";

import type { PaymentProviderDescriptor } from "../types";

/** Customer is handed off to WhatsApp to complete the order conversation. */
export const whatsappProvider: PaymentProviderDescriptor = {
  method: "whatsapp",
  kind: "external_handoff",
  defaultLabel: "WhatsApp",
  recordsPaymentOnCreate: false,
  requiresTransactionReference: false,
  initialPaymentStatus: "processing",
  resolveSettlementCurrency: () => "XAF",
  buildProviderPaymentId: ({ orderId }) => `whatsapp:${orderId}`,
  isConfigured: () => Boolean(env.NEXT_PUBLIC_WHATSAPP_NUMBER),
};
