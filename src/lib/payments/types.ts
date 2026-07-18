import type { OneProductPaymentMethod } from "@/domain/commerce/schemas";
import type { Enums } from "@/lib/database/schema";

/**
 * Payment abstraction (WS-2).
 *
 * Checkout / order code must never branch on a specific provider name. Instead
 * it resolves a `PaymentProviderDescriptor` from the registry and reads these
 * capability fields. Adding a provider later (PayPal, Apple Pay, Flutterwave,
 * CinetPay, ...) is a new descriptor module + registry entry — no change to the
 * order-creation flow.
 */

export type PaymentMethod = OneProductPaymentMethod;

export type PaymentKind =
  | "external_handoff" // customer completes payment off-platform (e.g. WhatsApp)
  | "manual_reference" // customer pays then submits a transaction reference (MoMo)
  | "redirect"; // customer is redirected to a hosted checkout (Stripe)

/**
 * Status a `payments` row is created with. Derived from the DB `payment_status`
 * enum so a schema rename is caught at compile time (see `db:types`).
 */
export type InitialPaymentStatus = Extract<
  Enums<"payment_status">,
  "requires_confirmation" | "processing"
>;

/** Persisted customer-facing payment instructions (stored on the order). */
export type PaymentInstructions = {
  heading: string;
  instructions: string;
  label: string;
  number: string;
  accountName?: string;
};

export type BuildProviderPaymentIdArgs = {
  orderId: string;
  transactionReference?: string | null | undefined;
};

export interface PaymentProviderDescriptor {
  method: PaymentMethod;
  kind: PaymentKind;
  /** Default human label; the CMS may override display copy at runtime. */
  defaultLabel: string;
  /** Whether a `payments` row is created when the order is placed. */
  recordsPaymentOnCreate: boolean;
  /** Whether the flow collects a customer-supplied transaction reference. */
  requiresTransactionReference: boolean;
  /** `payments.status` used when the row is first inserted. */
  initialPaymentStatus: InitialPaymentStatus;
  /** Settlement currency given the storefront default currency. */
  resolveSettlementCurrency: (defaultCurrency: string) => string;
  /** Value for `payments.provider_payment_id`. */
  buildProviderPaymentId: (args: BuildProviderPaymentIdArgs) => string;
  /** Whether this provider is usable given the current environment config. */
  isConfigured: () => boolean;
  /**
   * Optional substring to match CMS `manualPayments.methods` labels
   * (e.g. `"mtn"`). Used only for `manual_reference` providers.
   */
  cmsLabelMatch?: string;
}

/** Lightweight, client-safe view of an available payment method. */
export type PaymentMethodOption = {
  method: PaymentMethod;
  kind: PaymentKind;
  label: string;
  requiresTransactionReference: boolean;
};
