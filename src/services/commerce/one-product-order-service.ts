import type {
  AdminOrderStatusUpdateInput,
  CreateOneProductOrderInput,
  OneProductPaymentMethod,
  SubmitPaymentReferenceInput,
} from "@/domain/commerce/schemas";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getElixirContent, getWhatsAppUrl } from "@/features/elixir/lib/cms";
import { buildWaLink, config } from "@/lib/config";
import { AppError } from "@/lib/errors/app-error";
import { getConfiguredSiteUrl } from "@/lib/http/app-base-url";
import { logger } from "@/lib/logger/logger";
import { initiatePay, isFapshiConfigured } from "@/lib/payments/fapshi-client";
import { getPaymentProvider } from "@/lib/payments/registry";
import type { PaymentProviderDescriptor } from "@/lib/payments/types";
import { CAMEROON_MOBILE_LOCAL_PATTERN } from "@/lib/phone/cameroon";
import { writeAuditLog } from "@/lib/security/audit-log";
import { defaultEstimatedDeliveryWindow, getOrderStatusLabel } from "@/lib/order-status/registry";
import { logNotificationAttempt } from "@/lib/notifications/log";
import { isTwilioConfigured, sendSms } from "@/lib/sms/twilio-client";
import { queueOrderNotifications } from "@/services/commerce/order-notification-service";
import type { SupabaseClient } from "@supabase/supabase-js";

type CreatedOrderRow = {
  confirmation_token: string;
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
};

type CreateOrderOptions = {
  customerId?: string | null;
  /** Browser/deploy origin for payment return URLs. Falls back to NEXT_PUBLIC_SITE_URL. */
  returnBaseUrl?: string;
};

function createOrderNumber() {
  const entropy = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `FR-${Date.now().toString(36).toUpperCase()}-${entropy}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Same Cameroon-assumption E.164 normalization as
 * `lib/notifications/channels/customer-sms.ts` (not exported from there —
 * duplicated here rather than introducing a cross-module dependency for one
 * five-line helper). Keep both in sync if the assumption ever changes.
 */
function toReminderE164(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("237")) return `+${digits}`;
  if (CAMEROON_MOBILE_LOCAL_PATTERN.test(digits)) return `+237${digits}`;
  return null;
}

/**
 * 10% "Subscribe & save" discount for mobile money subscriptions.
 */
function applySubscriberDiscount(amountCents: number): number {
  return Math.max(0, Math.round(amountCents * 0.9));
}

function addOneMonth(date: Date): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
}

function parseXafAmount(price: string) {
  const numeric = Number.parseInt(price.replace(/[^\d]/g, ""), 10);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new AppError("INTERNAL", "Product XAF price is not configured.", { expose: false });
  }

  return numeric;
}

function getManualPaymentMethod(content: ElixirContent, method: OneProductPaymentMethod) {
  const provider = getPaymentProvider(method);
  const match = (provider.cmsLabelMatch ?? provider.defaultLabel).toLowerCase();
  const paymentMethod = content.manualPayments.methods.find((item) =>
    item.label.toLowerCase().includes(match),
  );

  if (!paymentMethod) {
    throw new AppError(
      "INTERNAL",
      `${provider.defaultLabel} payment instructions are not configured.`,
      { expose: false },
    );
  }

  return paymentMethod;
}

function getConfirmationUrl(token: string, baseUrl = getConfiguredSiteUrl()) {
  return `${baseUrl.replace(/\/$/, "")}/order-confirmation?token=${token}`;
}

function getPaymentInstructions(
  content: ElixirContent,
  locale: Locale,
  method: OneProductPaymentMethod,
) {
  const provider = getPaymentProvider(method);

  if (provider.kind === "external_handoff") {
    return {
      heading: t(content.whatsapp.label, locale),
      instructions: t(content.whatsapp.message, locale),
      label: provider.defaultLabel,
      number: content.whatsapp.phone,
    };
  }

  if (provider.kind === "redirect") {
    return {
      heading: locale.startsWith("fr") ? "Paiement Mobile Money" : "Mobile Money payment",
      instructions: locale.startsWith("fr")
        ? "Vous serez redirigé vers une page sécurisée pour payer avec MTN Mobile Money ou Orange Money."
        : "You will be redirected to a secure page to pay with MTN Mobile Money or Orange Money.",
      label: provider.defaultLabel,
      number: "",
    };
  }

  const manualMethod = getManualPaymentMethod(content, method);

  return {
    accountName: manualMethod.accountName,
    heading: manualMethod.label,
    instructions: t(manualMethod.instructions, locale),
    label: manualMethod.label,
    number: manualMethod.number,
  };
}

/**
 * Both `mtn_momo` and `orange_money` checkout buttons resolve here. Fapshi
 * fronts both networks behind one hosted payment link — the customer picks
 * MTN or Orange on Fapshi's own page, so there is nothing network-specific
 * left to branch on at this layer (unlike the direct MTN/Orange APIs, which
 * needed separate push-payment vs. hosted-redirect handling).
 */
async function createMobileMoneyCheckout(
  supabase: SupabaseClient,
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  returnBaseUrl: string,
): Promise<string> {
  // Charge exactly what the order row says (already subscriber-discounted
  // when input.subscribe is set) — recomputing from content.priceCents here
  // would silently ignore that discount and overcharge a MoMo/Orange subscriber.
  const xafTotal = order.total_cents;

  const { link, transId } = await initiatePay({
    amount: xafTotal,
    externalId: order.order_number,
    message: `Maison Fondjo order ${order.order_number}`,
    redirectUrl: getConfirmationUrl(order.confirmation_token, returnBaseUrl),
    ...(input.email ? { email: input.email } : {}),
  });

  const { error } = await supabase
    .from("orders")
    .update({ mobile_money_reference: transId })
    .eq("id", order.id);
  if (error) throw new AppError("BAD_REQUEST", error.message);

  return link;
}

async function createProviderCheckout(
  supabase: SupabaseClient,
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  provider: PaymentProviderDescriptor,
  returnBaseUrl: string,
) {
  if (provider.redirectProcessor === "mobile_money") {
    return createMobileMoneyCheckout(supabase, order, input, returnBaseUrl);
  }

  throw new AppError("INTERNAL", "Payment redirect is not configured for this method.", {
    expose: false,
  });
}

async function recordPayment(
  supabase: SupabaseClient,
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  content: ElixirContent,
) {
  const provider = getPaymentProvider(input.payment_method);

  if (!provider.recordsPaymentOnCreate) {
    return;
  }

  if (provider.requiresTransactionReference && !input.transaction_reference) {
    return;
  }

  // Charge exactly what the order row says (items + delivery).
  const amountCents = order.total_cents;

  const { error } = await supabase.from("payments").insert({
    amount_cents: amountCents,
    currency: provider.resolveSettlementCurrency(content.currency),
    metadata: {
      customer_phone: input.phone,
      manual_reference: input.transaction_reference || null,
      payment_method: input.payment_method,
    },
    order_id: order.id,
    provider: input.payment_method,
    provider_payment_id: provider.buildProviderPaymentId({
      orderId: order.id,
      transactionReference: input.transaction_reference,
    }),
    status: provider.initialPaymentStatus,
  });

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }
}

export async function createOneProductOrder(
  supabase: SupabaseClient,
  input: CreateOneProductOrderInput,
  options?: CreateOrderOptions,
) {
  const content = await getElixirContent(input.size);
  const locale = input.locale;
  const instructions = getPaymentInstructions(content, locale, input.payment_method);
  const provider = getPaymentProvider(input.payment_method);
  const isManualPayment = provider.kind === "manual_reference";
  const settlementCurrency = provider.resolveSettlementCurrency(content.currency);
  const customerId = options?.customerId ?? null;
  const returnBaseUrl = options?.returnBaseUrl ?? getConfiguredSiteUrl();

  if (!provider.isConfigured()) {
    throw new AppError(
      "BAD_REQUEST",
      `${provider.defaultLabel} is not available yet. Please pay by Mobile Money or contact Maison Fondjo on WhatsApp.`,
    );
  }

  // Subscribe & save is Mobile Money only (MTN MoMo / Orange Money). There is
  // no stored-card concept, so these are "manual-renewal" — see
  // activateMobileMoneySubscription() / the cron job in
  // api/cron/mobile-money-renewals.
  if (input.subscribe) {
    const subscriptionSupported =
      provider.redirectProcessor === "mobile_money" ? isFapshiConfigured() : false;

    if (!subscriptionSupported) {
      throw new AppError(
        "BAD_REQUEST",
        `Subscribe & save is not available for ${provider.defaultLabel} yet.`,
      );
    }

    if (!customerId) {
      throw new AppError(
        "UNAUTHORIZED",
        "Sign in to your Maison Fondjo account to start a subscription.",
      );
    }
  }

  const baseUnitCents = parseXafAmount(content.product.priceXaf);
  // The 10% subscriber discount is applied here so the order, the Fapshi
  // charge, and the SMS reminder all agree on one number.
  const unitCents =
    input.subscribe && provider.redirectProcessor === "mobile_money"
      ? applySubscriberDiscount(baseUnitCents)
      : baseUnitCents;
  const subtotalCents = unitCents * input.quantity;
  const shippingCents = config.delivery.min;
  const orderTotalCents = subtotalCents + shippingCents;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      billing_address: {
        city: input.city,
        country: provider.kind === "redirect" ? null : "CM",
        line1: input.delivery_address,
        name: input.name,
        phone: normalizePhone(input.phone),
      },
      currency: settlementCurrency,
      customer_id: customerId,
      customer_name: input.name,
      customer_phone: normalizePhone(input.phone),
      delivery_address: input.delivery_address,
      delivery_city: input.city,
      email: input.email || null,
      manual_payment_provider: isManualPayment ? instructions.label : null,
      manual_payment_reference: isManualPayment ? input.transaction_reference : null,
      metadata: {
        locale,
        notification_hooks: ["admin_email", "customer_email"],
        order_channel: "one_product_storefront",
        product_id: content.id,
        product_name: t(content.product.name, locale),
        quantity: input.quantity,
        size: input.size,
        ...(input.subscribe ? { is_subscription: true } : {}),
        ...(customerId ? { linked_customer_id: customerId } : {}),
      },
      order_number: createOrderNumber(),
      payment_instructions: instructions,
      payment_method: input.payment_method,
      placed_at: new Date().toISOString(),
      shipping_address: {
        city: input.city,
        country: provider.kind === "redirect" ? null : "CM",
        line1: input.delivery_address,
        name: input.name,
        phone: normalizePhone(input.phone),
      },
      status:
        isManualPayment && input.transaction_reference ? "payment_submitted" : "pending_payment",
      shipping_cents: shippingCents,
      subtotal_cents: subtotalCents,
      total_cents: orderTotalCents,
    })
    .select("id, order_number, status, total_cents, confirmation_token")
    .single<CreatedOrderRow>();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    metadata: {
      product_slug: content.slug,
    },
    order_id: order.id,
    quantity: input.quantity,
    title: t(content.product.name, locale),
    total_cents: subtotalCents,
    unit_price_cents: Math.round(subtotalCents / input.quantity),
    variant_title: t(content.product.size, locale),
  });

  if (itemError) {
    throw new AppError("BAD_REQUEST", itemError.message);
  }

  await recordPayment(supabase, order, input, content);

  await writeAuditLog(supabase, {
    action: "order.placed",
    afterData: {
      customer_id: customerId,
      payment_method: input.payment_method,
      quantity: input.quantity,
      status: order.status,
      total_cents: order.total_cents,
    },
    entityId: order.id,
    entityTable: "orders",
  });

  await supabase.from("order_status_events").insert({
    from_status: null,
    order_id: order.id,
    to_status: order.status,
  });

  const confirmationUrl = getConfirmationUrl(order.confirmation_token, returnBaseUrl);
  const totalLabel = `${order.total_cents} XAF`;
  const profileId = await resolveProfileIdForCustomer(supabase, customerId);

  await queueOrderNotifications({
    city: input.city,
    confirmationUrl,
    customerName: input.name,
    kind: "placed",
    locale,
    orderId: order.id,
    orderNumber: order.order_number,
    paymentMethod: instructions.label,
    phone: normalizePhone(input.phone),
    productName: t(content.product.name, locale),
    statusId: order.status,
    statusLabel: getOrderStatusLabel(order.status, locale),
    totalLabel,
    ...(input.email ? { customerEmail: input.email } : {}),
    ...(customerId ? { customerId } : {}),
    ...(profileId ? { profileId } : {}),
    ...(input.transaction_reference ? { transactionReference: input.transaction_reference } : {}),
  });

  if (provider.kind === "redirect") {
    const checkoutUrl = await createProviderCheckout(
      supabase,
      order,
      input,
      provider,
      returnBaseUrl,
    );

    return {
      checkoutUrl,
      confirmationUrl,
      order,
      paymentInstructions: instructions,
      whatsappUrl: getWhatsAppUrl(content, locale),
    };
  }

  return {
    confirmationUrl,
    order,
    paymentInstructions: instructions,
    whatsappUrl: buildWaLink("order"),
  };
}

export async function getOrderByConfirmationToken(supabase: SupabaseClient, token: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, currency, total_cents, customer_name, customer_phone, delivery_city, delivery_address, payment_method, manual_payment_reference, payment_instructions, created_at",
    )
    .eq("confirmation_token", token)
    .single();

  if (error) {
    throw new AppError("NOT_FOUND", "Order confirmation was not found.");
  }

  return data;
}

/**
 * Legacy endpoint — MoMo does not collect customer transaction references.
 * When a Mobile Money provider is wired, confirmation will be webhook-driven.
 */
export async function submitOrderPaymentReference(
  _supabase: SupabaseClient,
  _token: string,
  _input: SubmitPaymentReferenceInput,
): Promise<never> {
  throw new AppError(
    "BAD_REQUEST",
    "Mobile money payment is not available yet. Please pay by Mobile Money or contact Maison Fondjo on WhatsApp.",
  );
}

export async function listAdminOrders(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, fulfillment_status, currency, total_cents, customer_name, customer_phone, delivery_city, delivery_address, payment_method, manual_payment_reference, created_at, admin_payment_verified_at, admin_notes, estimated_delivery_start, estimated_delivery_end, email, metadata",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new AppError("INTERNAL", "Unable to list admin orders.", { expose: false });
  }

  return data;
}

export async function updateAdminOrderStatus(
  supabase: SupabaseClient,
  adminProfileId: string,
  orderId: string,
  input: AdminOrderStatusUpdateInput,
) {
  const { data: before } = await supabase
    .from("orders")
    .select("id, order_number, status, admin_notes")
    .eq("id", orderId)
    .maybeSingle<{
      admin_notes: string | null;
      id: string;
      order_number: string;
      status: string;
    }>();

  const now = new Date().toISOString();
  const update: Record<string, unknown> = {
    status: input.status,
    status_updated_at: now,
  };

  if (input.status === "confirmed") {
    update.admin_payment_verified_at = now;
    update.admin_payment_verified_by = adminProfileId;
    const window = defaultEstimatedDeliveryWindow();
    update.estimated_delivery_start = input.estimated_delivery_start ?? window.start;
    update.estimated_delivery_end = input.estimated_delivery_end ?? window.end;
  } else {
    if (input.estimated_delivery_start !== undefined) {
      update.estimated_delivery_start = input.estimated_delivery_start;
    }
    if (input.estimated_delivery_end !== undefined) {
      update.estimated_delivery_end = input.estimated_delivery_end;
    }
  }

  if (input.note?.trim()) {
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const line = `[${stamp}] ${input.note.trim()}`;
    update.admin_notes = before?.admin_notes ? `${before.admin_notes}\n${line}` : line;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select(
      "id, order_number, status, admin_payment_verified_at, admin_notes, estimated_delivery_start, estimated_delivery_end",
    )
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  await supabase.from("order_status_events").insert({
    actor_profile_id: adminProfileId,
    from_status: before?.status ?? null,
    note: input.note?.trim() || null,
    order_id: orderId,
    to_status: input.status,
  });

  if (input.status === "confirmed") {
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        captured_at: now,
        status: "succeeded",
      })
      .eq("order_id", orderId);

    if (paymentError) {
      throw new AppError("BAD_REQUEST", paymentError.message);
    }

    await notifyOrderConfirmed(supabase, orderId);
  } else if (before?.status !== input.status) {
    await notifyOrderStatusUpdated(supabase, orderId, input.status);
  }

  await writeAuditLog(supabase, {
    action: input.status === "confirmed" ? "payment.confirmed.admin" : "order.status_updated.admin",
    actorProfileId: adminProfileId,
    afterData: {
      admin_notes: data.admin_notes,
      order_number: data.order_number,
      status: data.status,
    },
    beforeData: before
      ? {
          order_number: before.order_number,
          status: before.status,
        }
      : null,
    entityId: orderId,
    entityTable: "orders",
  });

  return data;
}

async function resolveProfileIdForCustomer(
  supabase: SupabaseClient,
  customerId: string | null,
): Promise<string | null> {
  if (!customerId) return null;
  const { data } = await supabase
    .from("customers")
    .select("profile_id")
    .eq("id", customerId)
    .maybeSingle<{ profile_id: string }>();
  return data?.profile_id ?? null;
}

export async function notifyOrderConfirmed(supabase: SupabaseClient, orderId: string) {
  const { data: order } = await supabase
    .from("orders")
    .select(
      "order_number, total_cents, customer_name, customer_phone, delivery_city, payment_method, confirmation_token, email, customer_id, metadata",
    )
    .eq("id", orderId)
    .maybeSingle<{
      confirmation_token: string;
      customer_id: string | null;
      customer_name: string | null;
      customer_phone: string | null;
      delivery_city: string | null;
      email: string | null;
      metadata: { locale?: string; product_name?: string } | null;
      order_number: string;
      payment_method: string | null;
      total_cents: number;
    }>();

  if (!order) return;

  let paymentLabel = order.payment_method ?? "Payment";
  try {
    if (order.payment_method) {
      paymentLabel = getPaymentProvider(
        order.payment_method as OneProductPaymentMethod,
      ).defaultLabel;
    }
  } catch {
    // Keep raw payment_method if provider lookup fails.
  }

  const locale = order.metadata?.locale === "fr" ? "fr" : "en";
  const profileId = await resolveProfileIdForCustomer(supabase, order.customer_id);

  await queueOrderNotifications({
    city: order.delivery_city ?? "Unknown",
    confirmationUrl: getConfirmationUrl(order.confirmation_token),
    customerName: order.customer_name ?? "Customer",
    kind: "confirmed",
    locale,
    orderId,
    orderNumber: order.order_number,
    paymentMethod: paymentLabel,
    phone: order.customer_phone ?? "Unknown",
    statusId: "confirmed",
    statusLabel: getOrderStatusLabel("confirmed", locale),
    totalLabel: `${order.total_cents.toLocaleString("en-US")} XAF`,
    ...(order.email ? { customerEmail: order.email } : {}),
    ...(order.customer_id ? { customerId: order.customer_id } : {}),
    ...(profileId ? { profileId } : {}),
    ...(order.metadata?.product_name ? { productName: order.metadata.product_name } : {}),
  });
}

export async function notifyOrderStatusUpdated(
  supabase: SupabaseClient,
  orderId: string,
  statusId: string,
) {
  const { data: order } = await supabase
    .from("orders")
    .select(
      "order_number, total_cents, customer_name, customer_phone, delivery_city, payment_method, confirmation_token, email, customer_id, metadata",
    )
    .eq("id", orderId)
    .maybeSingle<{
      confirmation_token: string;
      customer_id: string | null;
      customer_name: string | null;
      customer_phone: string | null;
      delivery_city: string | null;
      email: string | null;
      metadata: { locale?: string; product_name?: string } | null;
      order_number: string;
      payment_method: string | null;
      total_cents: number;
    }>();

  if (!order) return;

  const locale = order.metadata?.locale === "fr" ? "fr" : "en";
  const statusLabel = getOrderStatusLabel(statusId, locale);
  const profileId = await resolveProfileIdForCustomer(supabase, order.customer_id);

  let paymentLabel = order.payment_method ?? "Payment";
  try {
    if (order.payment_method) {
      paymentLabel = getPaymentProvider(
        order.payment_method as OneProductPaymentMethod,
      ).defaultLabel;
    }
  } catch {
    // keep raw
  }

  await queueOrderNotifications({
    city: order.delivery_city ?? "Unknown",
    confirmationUrl: getConfirmationUrl(order.confirmation_token),
    customerName: order.customer_name ?? "Customer",
    kind: "status_updated",
    locale,
    orderId,
    orderNumber: order.order_number,
    paymentMethod: paymentLabel,
    phone: order.customer_phone ?? "Unknown",
    statusId,
    statusLabel,
    totalLabel: `${order.total_cents.toLocaleString("en-US")} XAF`,
    ...(order.email ? { customerEmail: order.email } : {}),
    ...(order.customer_id ? { customerId: order.customer_id } : {}),
    ...(profileId ? { profileId } : {}),
    ...(order.metadata?.product_name ? { productName: order.metadata.product_name } : {}),
  });
}

/**
 * Confirms a Mobile Money (Fapshi) order once the provider reports a
 * successful payment. Called from both the webhook (fast path, best-effort
 * delivery) and a status re-check (reliable fallback). Idempotent: safe to
 * call more than once for the same order.
 *
 * `payment_method` (mtn_momo vs. orange_money) is read back off the order
 * row rather than passed in — the webhook only knows the Fapshi `transId`,
 * never which button the customer originally clicked, so the order itself
 * is the only source of truth for which `payments` row to update.
 */
export async function fulfillMobileMoneyOrder(
  supabase: SupabaseClient,
  args: { mobileMoneyReference: string; providerPaymentId: string },
) {
  const { data: order, error: loadError } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, customer_id, payment_method, metadata, currency, total_cents",
    )
    .eq("mobile_money_reference", args.mobileMoneyReference)
    .maybeSingle<{
      currency: string;
      customer_id: string | null;
      id: string;
      metadata: Record<string, unknown> | null;
      order_number: string;
      payment_method: string | null;
      status: string;
      total_cents: number;
    }>();

  if (loadError || !order) {
    throw new AppError(
      "BAD_REQUEST",
      loadError?.message ??
        `No order found for mobile money reference ${args.mobileMoneyReference}.`,
    );
  }

  const provider = order.payment_method ?? "mtn_momo";

  if (
    order.status === "confirmed" ||
    order.status === "delivered" ||
    order.status === "shipped" ||
    order.status === "out_for_delivery"
  ) {
    return;
  }

  const deliveryWindow = defaultEstimatedDeliveryWindow();
  const now = new Date().toISOString();

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      estimated_delivery_end: deliveryWindow.end,
      estimated_delivery_start: deliveryWindow.start,
      status: "confirmed",
      status_updated_at: now,
    })
    .eq("id", order.id);

  if (orderError) {
    throw new AppError("BAD_REQUEST", orderError.message);
  }

  await supabase.from("order_status_events").insert({
    from_status: order.status,
    order_id: order.id,
    to_status: "confirmed",
  });

  await supabase
    .from("payments")
    .update({
      captured_at: now,
      provider_payment_id: args.providerPaymentId,
      status: "succeeded",
    })
    .eq("order_id", order.id)
    .eq("provider", provider);

  await writeAuditLog(supabase, {
    action: `payment.confirmed.${provider}`,
    afterData: {
      mobile_money_reference: args.mobileMoneyReference,
      order_number: order.order_number,
      provider_payment_id: args.providerPaymentId,
    },
    beforeData: { status: order.status },
    entityId: order.id,
    entityTable: "orders",
  });

  await notifyOrderConfirmed(supabase, order.id);

  // First payment of a new mobile-money subscription, or a renewal payment
  // for an existing one — either way, this is the moment the subscription's
  // billing clock should (re)start. Never on a plain one-time order.
  const metadata = order.metadata ?? {};
  if (metadata.is_subscription === true && order.customer_id) {
    if (metadata.order_channel === "subscription_renewal" && metadata.subscription_id) {
      await advanceMobileMoneySubscription(supabase, {
        orderId: order.id,
        subscriptionId: String(metadata.subscription_id),
      });
    } else if (metadata.order_channel === "one_product_storefront") {
      await activateMobileMoneySubscription(supabase, {
        currency: order.currency,
        customerId: order.customer_id,
        orderId: order.id,
        paymentMethod: order.payment_method,
        quantity: Number(metadata.quantity) || 1,
        totalCents: order.total_cents,
      });
    }
  }
}

/**
 * Creates the local `subscriptions` row the first time a MTN MoMo / Orange
 * Money subscribe order is actually paid (never at checkout time — a
 * subscription should never show "active" before money has changed hands).
 */
async function activateMobileMoneySubscription(
  supabase: SupabaseClient,
  args: {
    currency: string;
    customerId: string;
    orderId: string;
    paymentMethod: string | null;
    quantity: number;
    totalCents: number;
  },
) {
  const nextBillingAt = addOneMonth(new Date());

  const { error } = await supabase.from("subscriptions").insert({
    amount_cents: args.totalCents,
    billing_interval: "month",
    billing_provider: "mobile_money",
    currency: args.currency,
    customer_id: args.customerId,
    next_billing_at: nextBillingAt.toISOString(),
    order_id: args.orderId,
    payment_method: args.paymentMethod === "orange_money" ? "orange_money" : "mtn_momo",
    quantity: args.quantity,
    status: "active",
  });

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  await writeAuditLog(supabase, {
    action: "subscription.mobile_money.activated",
    afterData: { next_billing_at: nextBillingAt.toISOString(), order_id: args.orderId },
    entityId: args.orderId,
    entityTable: "subscriptions",
  });
}

/**
 * Confirms a renewal payment: pushes `next_billing_at` another month out
 * from its previous value (keeping the original anchor date stable cycle
 * over cycle, rather than drifting off of "whenever they happened to pay"),
 * clears the pending-renewal bookkeeping so the cron job will consider this
 * subscription again next cycle, and reactivates it if a missed payment had
 * previously pushed it to `past_due`.
 */
async function advanceMobileMoneySubscription(
  supabase: SupabaseClient,
  args: { orderId: string; subscriptionId: string },
) {
  const { data: subscription, error: lookupError } = await supabase
    .from("subscriptions")
    .select("next_billing_at")
    .eq("id", args.subscriptionId)
    .maybeSingle<{ next_billing_at: string | null }>();

  if (lookupError) {
    throw new AppError("BAD_REQUEST", lookupError.message);
  }

  const anchor = subscription?.next_billing_at
    ? new Date(subscription.next_billing_at)
    : new Date();
  const nextBillingAt = addOneMonth(anchor);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      last_reminder_sent_at: null,
      next_billing_at: nextBillingAt.toISOString(),
      order_id: args.orderId,
      pending_renewal_order_id: null,
      status: "active",
    })
    .eq("id", args.subscriptionId);

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  await writeAuditLog(supabase, {
    action: "subscription.mobile_money.renewed",
    afterData: { next_billing_at: nextBillingAt.toISOString(), order_id: args.orderId },
    entityId: args.subscriptionId,
    entityTable: "subscriptions",
  });
}

/**
 * Marks a Mobile Money (Fapshi) order as failed (customer declined, timed
 * out, or insufficient funds). Idempotent. See `fulfillMobileMoneyOrder` for
 * why `payment_method` is read off the order instead of passed in.
 */
export async function failMobileMoneyOrder(
  supabase: SupabaseClient,
  args: { mobileMoneyReference: string; reason?: string },
) {
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, payment_method")
    .eq("mobile_money_reference", args.mobileMoneyReference)
    .maybeSingle<{ id: string; status: string; payment_method: string | null }>();

  if (!order || order.status === "confirmed") return;

  const provider = order.payment_method ?? "mtn_momo";

  await supabase
    .from("payments")
    .update({ status: "failed" })
    .eq("order_id", order.id)
    .eq("provider", provider);

  await writeAuditLog(supabase, {
    action: `payment.failed.${provider}`,
    afterData: { mobile_money_reference: args.mobileMoneyReference, reason: args.reason ?? null },
    beforeData: { status: order.status },
    entityId: order.id,
    entityTable: "orders",
  });
}

type MobileMoneyRenewalResult = {
  locale: Locale;
  order: CreatedOrderRow;
  payLink: string;
  phone: string;
};

/**
 * Renewal order for a Mobile Money subscription: clones the originating
 * order's shipping/billing/metadata into a fresh order, driven by the daily
 * cron job, and the order starts `pending_payment` (not
 * `confirmed`) since nobody has paid yet — that only happens once the
 * customer approves the Fapshi link this returns, via the normal
 * `fulfillMobileMoneyOrder` webhook path. Returns `null` if the subscription
 * or its source order has gone missing (logged, never thrown — one bad
 * subscription shouldn't crash the whole cron run).
 */
export async function createMobileMoneyRenewalOrder(
  supabase: SupabaseClient,
  subscriptionId: string,
  returnBaseUrl = getConfiguredSiteUrl(),
): Promise<MobileMoneyRenewalResult | null> {
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("id, order_id, payment_method")
    .eq("id", subscriptionId)
    .maybeSingle<{ id: string; order_id: string | null; payment_method: string | null }>();

  if (subError) {
    throw new AppError("BAD_REQUEST", subError.message);
  }

  if (!subscription?.order_id) {
    logger.error("Mobile money renewal: subscription has no source order.", { subscriptionId });
    return null;
  }

  const { data: sourceOrder, error: orderError } = await supabase
    .from("orders")
    .select(
      "billing_address, currency, customer_id, customer_name, customer_phone, delivery_address, delivery_city, email, metadata, shipping_address",
    )
    .eq("id", subscription.order_id)
    .maybeSingle();

  if (orderError) {
    throw new AppError("BAD_REQUEST", orderError.message);
  }

  if (!sourceOrder) {
    logger.error("Mobile money renewal: source order no longer exists.", {
      orderId: subscription.order_id,
      subscriptionId,
    });
    return null;
  }

  const sourceMetadata: Record<string, unknown> =
    sourceOrder.metadata && typeof sourceOrder.metadata === "object"
      ? (sourceOrder.metadata as Record<string, unknown>)
      : {};
  const size: "100ml" | "50ml" = sourceMetadata.size === "50ml" ? "50ml" : "100ml";
  const quantity = Number(sourceMetadata.quantity) || 1;
  const locale: Locale = sourceMetadata.locale === "fr" ? "fr" : "en";
  const paymentMethod: OneProductPaymentMethod =
    subscription.payment_method === "orange_money" ? "orange_money" : "mtn_momo";
  const provider = getPaymentProvider(paymentMethod);

  const content = await getElixirContent(size);
  const unitCents = applySubscriberDiscount(parseXafAmount(content.product.priceXaf));
  const totalCents = unitCents * quantity;

  const { data: newOrder, error: insertError } = await supabase
    .from("orders")
    .insert({
      billing_address: sourceOrder.billing_address,
      currency: sourceOrder.currency,
      customer_id: sourceOrder.customer_id,
      customer_name: sourceOrder.customer_name,
      customer_phone: sourceOrder.customer_phone,
      delivery_address: sourceOrder.delivery_address,
      delivery_city: sourceOrder.delivery_city,
      email: sourceOrder.email,
      metadata: {
        ...sourceMetadata,
        order_channel: "subscription_renewal",
        subscription_id: subscription.id,
      },
      order_number: createOrderNumber(),
      payment_method: paymentMethod,
      placed_at: new Date().toISOString(),
      shipping_address: sourceOrder.shipping_address,
      status: "pending_payment",
      subtotal_cents: totalCents,
      total_cents: totalCents,
    })
    .select("id, order_number, status, total_cents, confirmation_token")
    .single<CreatedOrderRow>();

  if (insertError || !newOrder) {
    throw new AppError(
      "BAD_REQUEST",
      insertError?.message ?? "Failed to create mobile money renewal order.",
    );
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    metadata: { source: "subscription_renewal" },
    order_id: newOrder.id,
    quantity,
    title: t(content.product.name, locale),
    total_cents: totalCents,
    unit_price_cents: unitCents,
    variant_title: t(content.product.size, locale),
  });

  if (itemError) {
    throw new AppError("BAD_REQUEST", itemError.message);
  }

  const { link, transId } = await initiatePay({
    amount: totalCents,
    externalId: newOrder.order_number,
    message: `Maison Fondjo subscription renewal ${newOrder.order_number}`,
    redirectUrl: getConfirmationUrl(newOrder.confirmation_token, returnBaseUrl),
    ...(sourceOrder.email ? { email: sourceOrder.email } : {}),
  });

  const { error: refError } = await supabase
    .from("orders")
    .update({ mobile_money_reference: transId })
    .eq("id", newOrder.id);

  if (refError) {
    throw new AppError("BAD_REQUEST", refError.message);
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    amount_cents: totalCents,
    currency: provider.resolveSettlementCurrency(content.currency),
    metadata: {
      customer_phone: sourceOrder.customer_phone,
      payment_method: paymentMethod,
      source: "subscription_renewal",
    },
    order_id: newOrder.id,
    provider: paymentMethod,
    provider_payment_id: provider.buildProviderPaymentId({ orderId: newOrder.id }),
    status: provider.initialPaymentStatus,
  });

  if (paymentError) {
    throw new AppError("BAD_REQUEST", paymentError.message);
  }

  const { error: markReminderError } = await supabase
    .from("subscriptions")
    .update({
      last_reminder_sent_at: new Date().toISOString(),
      pending_renewal_order_id: newOrder.id,
    })
    .eq("id", subscription.id);

  if (markReminderError) {
    throw new AppError("BAD_REQUEST", markReminderError.message);
  }

  await writeAuditLog(supabase, {
    action: "subscription.mobile_money.renewal_reminder_sent",
    afterData: { amount_cents: totalCents, order_number: newOrder.order_number },
    entityId: newOrder.id,
    entityTable: "orders",
  });

  return { locale, order: newOrder, payLink: link, phone: sourceOrder.customer_phone };
}

/**
 * Texts the renewal payment link from `createMobileMoneyRenewalOrder` to the
 * customer. Best-effort like every other notification channel in this
 * codebase — a failed text never fails the cron run; the subscription just
 * gets picked up again (or eventually marked `past_due`) next time.
 */
export async function sendMobileMoneyRenewalReminder(result: MobileMoneyRenewalResult) {
  if (!isTwilioConfigured()) {
    logger.warn("Mobile money renewal reminder skipped. Twilio not configured.", {
      orderNumber: result.order.order_number,
    });
    return;
  }

  const to = toReminderE164(result.phone);
  if (!to) {
    logger.warn("Mobile money renewal reminder skipped. phone could not be resolved to E.164.", {
      orderNumber: result.order.order_number,
    });
    return;
  }

  const fr = result.locale === "fr";
  const amountLabel = `${result.order.total_cents} XAF`;
  const body = fr
    ? `Maison Fondjo: votre abonnement Sève Racine (${amountLabel}) est a renouveler. Payez ici pour continuer votre livraison: ${result.payLink}`
    : `Maison Fondjo: your Seve Racine subscription (${amountLabel}) is due for renewal. Pay here to continue your delivery: ${result.payLink}`;

  try {
    const sendResult = await sendSms({ body, to });
    logger.info("Mobile money renewal reminder sent.", {
      orderNumber: result.order.order_number,
      sid: sendResult.sid,
    });
    await logNotificationAttempt({
      channel: "customer_sms",
      kind: "subscription_renewal_due",
      orderId: result.order.id,
      providerId: sendResult.sid,
      recipient: to,
      status: "sent",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Failed to send mobile money renewal reminder.", {
      error: message,
      orderNumber: result.order.order_number,
    });
    await logNotificationAttempt({
      channel: "customer_sms",
      error: message,
      kind: "subscription_renewal_due",
      orderId: result.order.id,
      status: "failed",
    });
  }
}

/**
 * Daily grace-period sweep: a mobile-money subscription that's had an unpaid
 * renewal reminder outstanding for more than 7 days gets paused
 * (`status: "past_due"`) rather than reminded indefinitely. Nothing was ever
 * auto-charged, so this is purely "stop texting them" — the customer can
 * start a fresh subscription anytime from checkout. Returns the count paused,
 * for the cron route's response/logging.
 */
export async function markOverdueMobileMoneySubscriptions(
  supabase: SupabaseClient,
): Promise<number> {
  const graceCutoff = new Date();
  graceCutoff.setDate(graceCutoff.getDate() - 7);

  const { data: overdue, error } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("billing_provider", "mobile_money")
    .eq("status", "active")
    .not("pending_renewal_order_id", "is", null)
    .lte("last_reminder_sent_at", graceCutoff.toISOString());

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  for (const row of overdue ?? []) {
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ pending_renewal_order_id: null, status: "past_due" })
      .eq("id", row.id);

    if (updateError) {
      logger.error("Failed to mark overdue mobile money subscription past_due.", {
        message: updateError.message,
        subscriptionId: row.id,
      });
      continue;
    }

    await writeAuditLog(supabase, {
      action: "subscription.mobile_money.past_due",
      afterData: { subscription_id: row.id },
      entityId: row.id,
      entityTable: "subscriptions",
    });
  }

  return overdue?.length ?? 0;
}
