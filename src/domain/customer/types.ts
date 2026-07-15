import type { AuditedEntity } from "@/domain/shared/entity";

export type CustomerProfile = AuditedEntity & {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type CustomerAccount = {
  id: string;
  profileId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  referralCode: string;
  ordersCount: number;
  lifetimeValueCents: number;
  createdAt: string;
};

export type Address = {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
  phone: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type NotificationPreferences = {
  orderUpdates: boolean;
  promotions: boolean;
  productLaunches: boolean;
  hairCareTips: boolean;
};

/** Lightweight, customer-facing order shape for "My Orders" (distinct from the admin list). */
export type AccountOrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  currency: string;
  totalCents: number;
  paymentMethod: string | null;
  itemsCount: number;
  createdAt: string;
};

export type AccountOrderDetail = AccountOrderSummary & {
  deliveryCity: string | null;
  deliveryAddress: string | null;
  manualPaymentReference: string | null;
  trackingUrl: string | null;
  items: Array<{
    id: string;
    title: string;
    variantTitle: string | null;
    quantity: number;
    unitPriceCents: number;
    totalCents: number;
  }>;
};

/** Dashboard "Home" summary — kept intentionally small; expand per-widget as needed. */
export type AccountOverview = {
  account: CustomerAccount;
  latestOrder: AccountOrderSummary | null;
  ordersCount: number;
  hasAddress: boolean;
  profileCompletionPercent: number;
};

// Reserved for future account sections (see supabase/migrations/000010 for the
// matching DB rationale) — intentionally not modeled yet:
//   HairProfile, ConsultationHistoryEntry, LoyaltyAccount, ReferralSummary,
//   SavedPaymentMethodAlias, ProgressPhoto.
// Add types here alongside the table that backs each one.
