import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AddressInput,
  NotificationPreferencesInput,
  UpdateAddressInput,
  UpdateProfileInput,
} from "@/domain/customer/schemas";
import type {
  AccountInboxNotification,
  AccountOrderDetail,
  AccountOrderSummary,
  AccountOverview,
  Address,
  CustomerAccount,
  NotificationPreferences,
  SubscriptionSummary,
} from "@/domain/customer/types";
import { AppError } from "@/lib/errors/app-error";
import type { Tables } from "@/lib/database/schema";
import {
  getAccountPaymentStatus,
  getAccountPaymentStatusLabel,
  isActiveAccountOrder,
} from "@/lib/order-status/account-facets";
import { buildOrderTimeline, getOrderStatusLabel } from "@/lib/order-status/registry";
import { getStripeClient } from "@/lib/payments/stripe";
import { writeAuditLog } from "@/lib/security/audit-log";

/**
 * Business logic for the customer account surface (signed-in "My Account").
 * Every function is scoped to a single customer; callers must resolve the
 * customer via `getOrCreateCustomerAccount` (never trust a client-supplied id).
 */

type CustomerRow = Tables<"customers">;
type ProfileRow = Tables<"profiles">;
type AddressRow = Tables<"addresses">;
type OrderRow = Tables<"orders">;
type OrderItemRow = Tables<"order_items">;
type NotificationPreferencesRow = Pick<
  Tables<"customer_notification_preferences">,
  "order_updates" | "sms_updates" | "promotions" | "product_launches" | "hair_care_tips"
>;

/**
 * `subscriptions` has no generated `Tables<...>` entry (the schema.ts
 * codegen hasn't been run since migrations 000002/000017 added/extended this
 * table) — inline-typed here, matching the pattern already used throughout
 * `one-product-order-service.ts` for the same table.
 */
type SubscriptionRow = {
  id: string;
  customer_id: string;
  status: "active" | "paused" | "cancelled" | "past_due";
  billing_provider: "stripe" | "mobile_money";
  payment_method: "mtn_momo" | "orange_money" | null;
  stripe_subscription_id: string | null;
  quantity: number;
  amount_cents: number | null;
  currency: string | null;
  current_period_end: string | null;
  next_billing_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

function toSubscriptionSummary(row: SubscriptionRow): SubscriptionSummary {
  return {
    id: row.id,
    status: row.status,
    billingProvider: row.billing_provider,
    paymentMethod: row.billing_provider === "stripe" ? "card" : row.payment_method,
    quantity: row.quantity,
    amountCents: row.amount_cents,
    currency: row.currency,
    currentPeriodEnd: row.current_period_end,
    nextBillingAt: row.next_billing_at,
    cancelledAt: row.cancelled_at,
    createdAt: row.created_at,
  };
}

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function toCustomerAccount(customer: CustomerRow, profile: ProfileRow): CustomerAccount {
  return {
    id: customer.id,
    profileId: customer.profile_id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    referralCode: customer.referral_code,
    ordersCount: customer.orders_count,
    lifetimeValueCents: customer.lifetime_value_cents,
    createdAt: customer.created_at,
  };
}

function toAddress(row: AddressRow): Address {
  return {
    id: row.id,
    label: row.label,
    firstName: row.first_name,
    lastName: row.last_name,
    company: row.company,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    region: row.region,
    postalCode: row.postal_code,
    countryCode: row.country_code,
    phone: row.phone,
    isDefaultShipping: row.is_default_shipping,
    isDefaultBilling: row.is_default_billing,
  };
}

function toOrderSummary(row: OrderRow, itemsCount: number, locale = "en"): AccountOrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    statusLabel: getOrderStatusLabel(row.status, locale),
    paymentStatus: getAccountPaymentStatus(row.status),
    paymentStatusLabel: getAccountPaymentStatusLabel(row.status, locale),
    fulfillmentStatus: row.fulfillment_status,
    currency: row.currency,
    totalCents: row.total_cents,
    paymentMethod: row.payment_method,
    itemsCount,
    createdAt: row.created_at,
    estimatedDeliveryStart: row.estimated_delivery_start ?? null,
    estimatedDeliveryEnd: row.estimated_delivery_end ?? null,
  };
}

/**
 * Resolves the `customers` row for an authenticated user, creating it
 * defensively if the `on_auth_user_created_provision_customer` DB trigger
 * (see `supabase/migrations/000010`) hasn't run yet for this user — e.g. users
 * created before that migration shipped.
 */
export async function getOrCreateCustomerAccount(
  supabase: SupabaseClient,
  userId: string,
): Promise<CustomerAccount> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw new AppError("INTERNAL", "Unable to load profile.", { expose: false });
  }

  if (!profile) {
    throw new AppError("NOT_FOUND", "Profile not found for the current user.");
  }

  const { data: existingCustomer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("profile_id", userId)
    .maybeSingle<CustomerRow>();

  if (customerError) {
    throw new AppError("INTERNAL", "Unable to load customer account.", { expose: false });
  }

  let customer = existingCustomer;

  if (!customer) {
    const { data: createdCustomer, error: createError } = await supabase
      .from("customers")
      .insert({ profile_id: userId, referral_code: generateReferralCode() })
      .select("*")
      .single<CustomerRow>();

    if (createError || !createdCustomer) {
      throw new AppError("INTERNAL", "Unable to create customer account.", { expose: false });
    }

    customer = createdCustomer;
  }

  // Best-effort: attach any orders this person placed as a guest (same email
  // or phone) before they had an account. Runs on every resolve, not just
  // first creation, so it still catches up if Supabase's email-confirmation
  // step delayed the session past the order that originally prompted signup.
  // Never blocks — orders stay reachable via their confirmation link either way.
  try {
    await claimGuestOrdersForCustomer(supabase, customer.id, {
      email: profile.email,
      phone: profile.phone,
    });
  } catch {
    // ignore
  }

  return toCustomerAccount(customer, profile);
}

/**
 * Attaches past guest orders (placed with no account, `customer_id` null) to
 * a newly created customer when the order's email or phone matches this
 * customer's profile. Matching is `OR` — either signal is enough — and only
 * ever touches orders that are still unclaimed, so it is safe to call
 * repeatedly and can never steal an order already linked to someone else.
 */
export async function claimGuestOrdersForCustomer(
  supabase: SupabaseClient,
  customerId: string,
  match: { email?: string | null; phone?: string | null },
): Promise<number> {
  const normalizedEmail = match.email?.trim().toLowerCase() || null;
  const normalizedPhone = match.phone ? match.phone.replace(/[^\d+]/g, "") : null;

  const filters: string[] = [];
  if (normalizedEmail) filters.push(`email.ilike.${normalizedEmail}`);
  if (normalizedPhone) filters.push(`customer_phone.eq.${normalizedPhone}`);

  if (filters.length === 0) return 0;

  const { data, error } = await supabase
    .from("orders")
    .update({ customer_id: customerId })
    .is("customer_id", null)
    .or(filters.join(","))
    .select("id");

  if (error) {
    throw new AppError("INTERNAL", "Unable to link previous orders.", { expose: false });
  }

  return data?.length ?? 0;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateProfileInput,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone || null,
    })
    .eq("id", userId)
    .select("*")
    .single<ProfileRow>();

  if (error || !data) {
    throw new AppError("BAD_REQUEST", error?.message ?? "Unable to update profile.");
  }

  return data;
}

export async function listAddresses(
  supabase: SupabaseClient,
  customerId: string,
): Promise<Address[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .returns<AddressRow[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to list addresses.", { expose: false });
  }

  return data.map(toAddress);
}

export async function createAddress(
  supabase: SupabaseClient,
  customerId: string,
  input: AddressInput,
): Promise<Address> {
  const { data, error } = await supabase
    .from("addresses")
    .insert({
      customer_id: customerId,
      label: input.label || null,
      first_name: input.firstName,
      last_name: input.lastName,
      company: input.company || null,
      line1: input.line1,
      line2: input.line2 || null,
      city: input.city,
      region: input.region,
      postal_code: input.postalCode,
      country_code: input.countryCode.toUpperCase(),
      phone: input.phone || null,
      is_default_shipping: input.isDefaultShipping,
      is_default_billing: input.isDefaultBilling,
    })
    .select("*")
    .single<AddressRow>();

  if (error || !data) {
    throw new AppError("BAD_REQUEST", error?.message ?? "Unable to save address.");
  }

  return toAddress(data);
}

export async function updateAddress(
  supabase: SupabaseClient,
  customerId: string,
  addressId: string,
  input: UpdateAddressInput,
): Promise<Address> {
  const update: Record<string, unknown> = {};

  if (input.label !== undefined) update.label = input.label || null;
  if (input.firstName !== undefined) update.first_name = input.firstName;
  if (input.lastName !== undefined) update.last_name = input.lastName;
  if (input.company !== undefined) update.company = input.company || null;
  if (input.line1 !== undefined) update.line1 = input.line1;
  if (input.line2 !== undefined) update.line2 = input.line2 || null;
  if (input.city !== undefined) update.city = input.city;
  if (input.region !== undefined) update.region = input.region;
  if (input.postalCode !== undefined) update.postal_code = input.postalCode;
  if (input.countryCode !== undefined) update.country_code = input.countryCode.toUpperCase();
  if (input.phone !== undefined) update.phone = input.phone || null;
  if (input.isDefaultShipping !== undefined) update.is_default_shipping = input.isDefaultShipping;
  if (input.isDefaultBilling !== undefined) update.is_default_billing = input.isDefaultBilling;

  const { data, error } = await supabase
    .from("addresses")
    .update(update)
    .eq("id", addressId)
    .eq("customer_id", customerId)
    .select("*")
    .single<AddressRow>();

  if (error || !data) {
    throw new AppError("NOT_FOUND", "Address not found.");
  }

  return toAddress(data);
}

export async function deleteAddress(
  supabase: SupabaseClient,
  customerId: string,
  addressId: string,
): Promise<void> {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }
}

async function countItemsByOrderId(supabase: SupabaseClient, orderIds: string[]) {
  if (orderIds.length === 0) {
    return new Map<string, number>();
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("order_id, quantity")
    .in("order_id", orderIds)
    .returns<Pick<OrderItemRow, "order_id" | "quantity">[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load order items.", { expose: false });
  }

  const counts = new Map<string, number>();
  data.forEach((item) => {
    counts.set(item.order_id, (counts.get(item.order_id) ?? 0) + item.quantity);
  });

  return counts;
}

export async function listOrdersForCustomer(
  supabase: SupabaseClient,
  customerId: string,
  locale = "en",
): Promise<AccountOrderSummary[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to list orders.", { expose: false });
  }

  const counts = await countItemsByOrderId(
    supabase,
    data.map((order) => order.id),
  );

  return data.map((order) => toOrderSummary(order, counts.get(order.id) ?? 0, locale));
}

export async function getOrderForCustomer(
  supabase: SupabaseClient,
  customerId: string,
  orderId: string,
  locale = "en",
): Promise<AccountOrderDetail> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .maybeSingle<OrderRow>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load order.", { expose: false });
  }

  if (!order) {
    throw new AppError("NOT_FOUND", "Order not found.");
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .returns<OrderItemRow[]>();

  if (itemsError) {
    throw new AppError("INTERNAL", "Unable to load order items.", { expose: false });
  }

  const includePaymentSubmitted =
    order.status === "payment_submitted" || Boolean(order.manual_payment_reference);

  return {
    ...toOrderSummary(order, items.length, locale),
    deliveryCity: order.delivery_city,
    deliveryAddress: order.delivery_address,
    manualPaymentReference: order.manual_payment_reference,
    email: order.email,
    customerName: order.customer_name,
    // Populated once fulfillment creates `shipments` rows for this order flow;
    // wire a join here when shipment tracking is implemented (see 000002 schema).
    trackingUrl: null,
    timeline: buildOrderTimeline(order.status, locale, { includePaymentSubmitted }),
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      variantTitle: item.variant_title,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
      totalCents: item.total_cents,
    })),
  };
}

const defaultNotificationPreferences: NotificationPreferences = {
  orderUpdates: true,
  smsUpdates: true,
  promotions: true,
  productLaunches: true,
  hairCareTips: true,
};

export async function getNotificationPreferences(
  supabase: SupabaseClient,
  customerId: string,
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from("customer_notification_preferences")
    .select("order_updates, sms_updates, promotions, product_launches, hair_care_tips")
    .eq("customer_id", customerId)
    .maybeSingle<NotificationPreferencesRow>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load notification preferences.", { expose: false });
  }

  if (!data) {
    return defaultNotificationPreferences;
  }

  return {
    orderUpdates: data.order_updates,
    smsUpdates: data.sms_updates,
    promotions: data.promotions,
    productLaunches: data.product_launches,
    hairCareTips: data.hair_care_tips,
  };
}

export async function updateNotificationPreferences(
  supabase: SupabaseClient,
  customerId: string,
  input: NotificationPreferencesInput,
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from("customer_notification_preferences")
    .upsert(
      {
        customer_id: customerId,
        order_updates: input.orderUpdates,
        sms_updates: input.smsUpdates,
        promotions: input.promotions,
        product_launches: input.productLaunches,
        hair_care_tips: input.hairCareTips,
      },
      { onConflict: "customer_id" },
    )
    .select("order_updates, sms_updates, promotions, product_launches, hair_care_tips")
    .single<NotificationPreferencesRow>();

  if (error || !data) {
    throw new AppError("BAD_REQUEST", error?.message ?? "Unable to update preferences.");
  }

  return {
    orderUpdates: data.order_updates,
    smsUpdates: data.sms_updates,
    promotions: data.promotions,
    productLaunches: data.product_launches,
    hairCareTips: data.hair_care_tips,
  };
}

/**
 * Returns the customer's most recent subscription (there is at most one
 * active one in practice, since checkout only lets you start a new
 * subscription when you don't already have one) regardless of billing
 * provider. `null` when they've never subscribed.
 */
export async function getSubscriptionForCustomer(
  supabase: SupabaseClient,
  customerId: string,
): Promise<SubscriptionSummary | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "id, customer_id, status, billing_provider, payment_method, stripe_subscription_id, quantity, amount_cents, currency, current_period_end, next_billing_at, cancelled_at, created_at",
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load subscription.", { expose: false });
  }

  return data ? toSubscriptionSummary(data) : null;
}

/**
 * Cancels the customer's subscription. Branches by `billing_provider`:
 * - `stripe`: cancels at Stripe (source of truth) — the `subscriptions` row
 *   itself is updated by the `customer.subscription.deleted` webhook
 *   (`syncSubscriptionStatus`), not here, so this stays correct even if the
 *   webhook is delayed or this call is retried.
 * - `mobile_money`: nothing external is charging the customer in the first
 *   place (manual-renewal via payment-link reminders), so cancelling is just
 *   a local status update and clearing any pending renewal order so the cron
 *   job stops sending reminders.
 */
export async function cancelSubscriptionForCustomer(
  supabase: SupabaseClient,
  customerId: string,
  subscriptionId: string,
): Promise<SubscriptionSummary> {
  const { data: subscription, error: lookupError } = await supabase
    .from("subscriptions")
    .select(
      "id, customer_id, status, billing_provider, payment_method, stripe_subscription_id, quantity, amount_cents, currency, current_period_end, next_billing_at, cancelled_at, created_at",
    )
    .eq("id", subscriptionId)
    .eq("customer_id", customerId)
    .maybeSingle<SubscriptionRow>();

  if (lookupError) {
    throw new AppError("INTERNAL", "Unable to load subscription.", { expose: false });
  }

  if (!subscription) {
    throw new AppError("NOT_FOUND", "Subscription not found.");
  }

  if (subscription.status === "cancelled") {
    return toSubscriptionSummary(subscription);
  }

  if (subscription.billing_provider === "stripe") {
    if (!subscription.stripe_subscription_id) {
      throw new AppError("INTERNAL", "Subscription is missing its Stripe reference.", {
        expose: false,
      });
    }

    const stripe = getStripeClient();
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

    // Reflect immediately rather than waiting for the webhook round-trip, so
    // the account UI updates right away; the webhook will arrive shortly
    // after and upsert the same (idempotent) end state.
    const { data: updated, error: updateError } = await supabase
      .from("subscriptions")
      .update({ cancelled_at: new Date().toISOString(), status: "cancelled" })
      .eq("id", subscriptionId)
      .select(
        "id, customer_id, status, billing_provider, payment_method, stripe_subscription_id, quantity, amount_cents, currency, current_period_end, next_billing_at, cancelled_at, created_at",
      )
      .single<SubscriptionRow>();

    if (updateError || !updated) {
      throw new AppError("BAD_REQUEST", updateError?.message ?? "Unable to cancel subscription.");
    }

    await writeAuditLog(supabase, {
      action: "subscription.cancelled",
      afterData: { billing_provider: "stripe" },
      entityId: subscriptionId,
      entityTable: "subscriptions",
    });

    return toSubscriptionSummary(updated);
  }

  const { data: updated, error: updateError } = await supabase
    .from("subscriptions")
    .update({
      cancelled_at: new Date().toISOString(),
      pending_renewal_order_id: null,
      status: "cancelled",
    })
    .eq("id", subscriptionId)
    .select(
      "id, customer_id, status, billing_provider, payment_method, stripe_subscription_id, quantity, amount_cents, currency, current_period_end, next_billing_at, cancelled_at, created_at",
    )
    .single<SubscriptionRow>();

  if (updateError || !updated) {
    throw new AppError("BAD_REQUEST", updateError?.message ?? "Unable to cancel subscription.");
  }

  await writeAuditLog(supabase, {
    action: "subscription.cancelled",
    afterData: { billing_provider: "mobile_money" },
    entityId: subscriptionId,
    entityTable: "subscriptions",
  });

  return toSubscriptionSummary(updated);
}

export async function listInboxNotifications(
  supabase: SupabaseClient,
  profileId: string,
  limit = 20,
): Promise<AccountInboxNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, subject, body, data, read_at, created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    // Table may be empty or temporarily unavailable — never break the account shell.
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    subject: row.subject,
    body: row.body,
    createdAt: row.created_at,
    readAt: row.read_at ?? null,
    data: (row.data as Record<string, unknown> | null) ?? null,
  }));
}

export async function markInboxNotificationRead(
  supabase: SupabaseClient,
  profileId: string,
  notificationId: string,
): Promise<AccountInboxNotification | null> {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("profile_id", profileId)
    .select("id, subject, body, data, read_at, created_at")
    .maybeSingle();

  if (error || !data) {
    throw new AppError("NOT_FOUND", "Notification not found.");
  }

  return {
    id: data.id,
    subject: data.subject,
    body: data.body,
    createdAt: data.created_at,
    readAt: data.read_at ?? null,
    data: (data.data as Record<string, unknown> | null) ?? null,
  };
}

export async function getAccountOverview(
  supabase: SupabaseClient,
  userId: string,
  locale = "en",
): Promise<AccountOverview> {
  const account = await getOrCreateCustomerAccount(supabase, userId);
  const orders = await listOrdersForCustomer(supabase, account.id, locale);
  const addresses = await listAddresses(supabase, account.id);
  const recentNotifications = await listInboxNotifications(supabase, account.profileId, 5);

  const completionFields = [
    account.firstName,
    account.lastName,
    account.phone,
    addresses.length > 0 ? "has_address" : null,
  ];
  const completedCount = completionFields.filter(Boolean).length;

  return {
    account,
    latestOrder: orders[0] ?? null,
    activeOrdersCount: orders.filter((order) => isActiveAccountOrder(order.status)).length,
    ordersCount: orders.length,
    hasAddress: addresses.length > 0,
    profileCompletionPercent: Math.round((completedCount / completionFields.length) * 100),
    recentNotifications,
  };
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "Customer", lastName: "Guest" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: parts[0]! };
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

export type CheckoutAccountPrefill = {
  city: string;
  deliveryAddress: string;
  email: string;
  name: string;
  phone: string;
};

/** Prefill checkout from profile + default shipping address when signed in. */
export async function getCheckoutAccountPrefill(
  supabase: SupabaseClient,
  userId: string,
): Promise<CheckoutAccountPrefill | null> {
  try {
    const account = await getOrCreateCustomerAccount(supabase, userId);
    const addresses = await listAddresses(supabase, account.id);
    const shipping = addresses.find((address) => address.isDefaultShipping) ?? addresses[0] ?? null;

    const nameFromProfile = [account.firstName, account.lastName].filter(Boolean).join(" ").trim();
    const nameFromAddress = shipping ? `${shipping.firstName} ${shipping.lastName}`.trim() : "";

    return {
      city: shipping?.city ?? "",
      deliveryAddress: shipping?.line1 ?? "",
      email: account.email ?? "",
      name: nameFromProfile || nameFromAddress,
      phone: shipping?.phone || account.phone || "",
    };
  } catch {
    return null;
  }
}

type CheckoutDeliverySnapshot = {
  city: string;
  deliveryAddress: string;
  name: string;
  phone: string;
};

/**
 * Persist checkout delivery details onto the customer account address book.
 * Best-effort: never throws to the order caller.
 */
export async function saveCheckoutDeliveryAddress(
  supabase: SupabaseClient,
  customerId: string,
  snapshot: CheckoutDeliverySnapshot,
): Promise<Address | null> {
  try {
    const { firstName, lastName } = splitFullName(snapshot.name);
    const line1 = snapshot.deliveryAddress.trim();
    const city = snapshot.city.trim();
    if (!line1 || !city) return null;

    const existing = await listAddresses(supabase, customerId);
    const match = existing.find(
      (address) =>
        address.line1.trim().toLowerCase() === line1.toLowerCase() &&
        address.city.trim().toLowerCase() === city.toLowerCase(),
    );

    if (match) {
      return updateAddress(supabase, customerId, match.id, {
        firstName,
        lastName,
        phone: snapshot.phone,
        isDefaultShipping: true,
        isDefaultBilling: true,
      });
    }

    const isFirst = existing.length === 0;

    return createAddress(supabase, customerId, {
      firstName,
      lastName,
      line1,
      city,
      region: city,
      postalCode: "00000",
      countryCode: "CM",
      phone: snapshot.phone,
      label: isFirst ? "Home" : "Delivery",
      isDefaultShipping: true,
      isDefaultBilling: isFirst || !existing.some((address) => address.isDefaultBilling),
    });
  } catch {
    return null;
  }
}
