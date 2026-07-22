import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AddressInput,
  NotificationPreferencesInput,
  UpdateAddressInput,
  UpdateProfileInput,
} from "@/domain/customer/schemas";
import type {
  AccountOrderDetail,
  AccountOrderSummary,
  AccountOverview,
  Address,
  CustomerAccount,
  NotificationPreferences,
} from "@/domain/customer/types";
import { AppError } from "@/lib/errors/app-error";
import type { Tables } from "@/lib/database/schema";

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
  "order_updates" | "promotions" | "product_launches" | "hair_care_tips"
>;

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

function toOrderSummary(row: OrderRow, itemsCount: number): AccountOrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    fulfillmentStatus: row.fulfillment_status,
    currency: row.currency,
    totalCents: row.total_cents,
    paymentMethod: row.payment_method,
    itemsCount,
    createdAt: row.created_at,
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

  if (existingCustomer) {
    return toCustomerAccount(existingCustomer, profile);
  }

  const { data: createdCustomer, error: createError } = await supabase
    .from("customers")
    .insert({ profile_id: userId, referral_code: generateReferralCode() })
    .select("*")
    .single<CustomerRow>();

  if (createError || !createdCustomer) {
    throw new AppError("INTERNAL", "Unable to create customer account.", { expose: false });
  }

  return toCustomerAccount(createdCustomer, profile);
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

  return data.map((order) => toOrderSummary(order, counts.get(order.id) ?? 0));
}

export async function getOrderForCustomer(
  supabase: SupabaseClient,
  customerId: string,
  orderId: string,
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

  return {
    ...toOrderSummary(order, items.length),
    deliveryCity: order.delivery_city,
    deliveryAddress: order.delivery_address,
    manualPaymentReference: order.manual_payment_reference,
    // Populated once fulfillment creates `shipments` rows for this order flow;
    // wire a join here when shipment tracking is implemented (see 000002 schema).
    trackingUrl: null,
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
    .select("order_updates, promotions, product_launches, hair_care_tips")
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
        promotions: input.promotions,
        product_launches: input.productLaunches,
        hair_care_tips: input.hairCareTips,
      },
      { onConflict: "customer_id" },
    )
    .select("order_updates, promotions, product_launches, hair_care_tips")
    .single<NotificationPreferencesRow>();

  if (error || !data) {
    throw new AppError("BAD_REQUEST", error?.message ?? "Unable to update preferences.");
  }

  return {
    orderUpdates: data.order_updates,
    promotions: data.promotions,
    productLaunches: data.product_launches,
    hairCareTips: data.hair_care_tips,
  };
}

export async function getAccountOverview(
  supabase: SupabaseClient,
  userId: string,
): Promise<AccountOverview> {
  const account = await getOrCreateCustomerAccount(supabase, userId);
  const orders = await listOrdersForCustomer(supabase, account.id);
  const addresses = await listAddresses(supabase, account.id);

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
    ordersCount: orders.length,
    hasAddress: addresses.length > 0,
    profileCompletionPercent: Math.round((completedCount / completionFields.length) * 100),
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
