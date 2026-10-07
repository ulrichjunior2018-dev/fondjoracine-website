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
  /** Order-status SMS opt-in, independent of `orderUpdates` (email). */
  smsUpdates: boolean;
  promotions: boolean;
  productLaunches: boolean;
  hairCareTips: boolean;
};

/** Lightweight, customer-facing order shape for "My Orders" (distinct from the admin list). */
export type AccountOrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  paymentStatus: "pending" | "paid" | "refunded" | "cancelled";
  paymentStatusLabel: string;
  fulfillmentStatus: string;
  currency: string;
  totalCents: number;
  paymentMethod: string | null;
  itemsCount: number;
  createdAt: string;
  estimatedDeliveryStart: string | null;
  estimatedDeliveryEnd: string | null;
};

export type AccountOrderTimelineStep = {
  id: string;
  label: string;
  tone: string;
  state: "complete" | "current" | "upcoming";
};

export type AccountOrderDetail = AccountOrderSummary & {
  deliveryCity: string | null;
  deliveryAddress: string | null;
  manualPaymentReference: string | null;
  email: string | null;
  customerName: string | null;
  trackingUrl: string | null;
  timeline: AccountOrderTimelineStep[];
  items: Array<{
    id: string;
    title: string;
    variantTitle: string | null;
    quantity: number;
    unitPriceCents: number;
    totalCents: number;
  }>;
};

export type AccountInboxNotification = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  data: Record<string, unknown> | null;
};

/** Dashboard "Home" summary — kept intentionally small; expand per-widget as needed. */
export type AccountOverview = {
  account: CustomerAccount;
  latestOrder: AccountOrderSummary | null;
  activeOrdersCount: number;
  ordersCount: number;
  hasAddress: boolean;
  profileCompletionPercent: number;
  recentNotifications: AccountInboxNotification[];
};

/**
 * Customer-facing view of a `subscriptions` row (see supabase/migrations/
 * 000002 + 000017). Covers both billing providers — Stripe (card, auto-charge)
 * and mobile money (manual-renewal via payment-link reminders) — behind one
 * shape so the account UI doesn't need to branch on provider except for the
 * cancel button's label/confirmation copy.
 */
export type SubscriptionSummary = {
  id: string;
  status: "active" | "paused" | "past_due" | "cancelled";
  billingProvider: "stripe" | "mobile_money";
  paymentMethod: "card" | "mtn_momo" | "orange_money" | null;
  quantity: number;
  amountCents: number | null;
  currency: string | null;
  /** Card subscriptions only — Stripe's own billing-cycle end. */
  currentPeriodEnd: string | null;
  /** Mobile money subscriptions only — when the next renewal reminder is due. */
  nextBillingAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
};

// Reserved for future account sections (see supabase/migrations/000010 for the
// matching DB rationale) — intentionally not modeled yet:
//   HairProfile, ConsultationHistoryEntry, LoyaltyAccount, ReferralSummary,
//   SavedPaymentMethodAlias, ProgressPhoto.
// Add types here alongside the table that backs each one.
