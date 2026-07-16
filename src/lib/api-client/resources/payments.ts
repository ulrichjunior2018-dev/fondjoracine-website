import type { ApiClient } from "../client";

export type PaymentMethodOption = {
  method: "whatsapp" | "mtn_momo" | "orange_money" | "stripe";
  kind: "external_handoff" | "manual_reference" | "redirect";
  label: string;
  requiresTransactionReference: boolean;
};

/** Fetch the payment methods available for the current deployment. */
export function listPaymentMethods(client: ApiClient): Promise<PaymentMethodOption[]> {
  return client.get<PaymentMethodOption[]>("/payment-methods");
}
