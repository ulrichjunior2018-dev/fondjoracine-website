import type Stripe from "stripe";

import { env } from "@/config/env";
import type {
  AdminOrderStatusUpdateInput,
  CreateOneProductOrderInput,
  OneProductPaymentMethod,
  SubmitPaymentReferenceInput,
} from "@/domain/commerce/schemas";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getElixirContent, getWhatsAppUrl } from "@/features/elixir/lib/cms";
import { buildWaLink } from "@/lib/config";
import type { Enums } from "@/lib/database/schema";
import { AppError } from "@/lib/errors/app-error";
import { getConfiguredSiteUrl } from "@/lib/http/app-base-url";
import { logger } from "@/lib/logger/logger";
import { getPaymentProvider } from "@/lib/payments/registry";
import { assertStripePriceId, getStripeClient } from "@/lib/payments/stripe";
import type { PaymentProviderDescriptor } from "@/lib/payments/types";
import { writeAuditLog } from "@/lib/security/audit-log";
import { defaultEstimatedDeliveryWindow, getOrderStatusLabel } from "@/lib/order-status/registry";
import { queueOrderNotifications } from "@/services/commerce/order-notification-service";
import type { SupabaseClient } from "@supabase/supabase-js";

type SubscriptionStatus = Enums<"subscription_status">;

type CreatedOrderRow = {
  confirmation_token: string;
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
};

type CreateOrderOptions = {
  customerId?: string | null;
  /** Browser/deploy origin for Stripe return URLs. Falls back to NEXT_PUBLIC_SITE_URL. */
  returnBaseUrl?: string;
};

function createOrderNumber() {
  const entropy = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `FR-${Date.now().toString(36).toUpperCase()}-${entropy}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
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

function getCheckoutCancelUrl(token: string, baseUrl = getConfiguredSiteUrl()) {
  return `${baseUrl.replace(/\/$/, "")}/checkout?status=cancelled&token=${token}`;
}

function getAssetUrl(path: string, baseUrl = getConfiguredSiteUrl()) {
  if (path.startsWith("http")) return path;
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Card checkout currency for Stripe. Storefront displays XAF, but many Stripe
 * accounts reject ad-hoc XAF `price_data`. Prefer a Dashboard Price ID; otherwise
 * settle in EUR using the CFA franc peg (655.957 XAF = 1 EUR).
 */
function resolveStripeInlinePrice(content: ElixirContent) {
  const storeCurrency = content.currency.toUpperCase();
  if (storeCurrency === "XAF") {
    return {
      currency: "eur",
      unit_amount: Math.max(50, Math.round((content.priceCents / 655.957) * 100)),
    };
  }

  return {
    currency: storeCurrency.toLowerCase(),
    unit_amount: content.priceCents,
  };
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
    if (provider.redirectProcessor === "mobile_money") {
      return {
        heading: locale.startsWith("fr") ? "Paiement Mobile Money" : "Mobile Money payment",
        instructions: locale.startsWith("fr")
          ? "Le paiement Mobile Money sera bientôt disponible."
          : "Mobile Money payment is coming soon.",
        label: provider.defaultLabel,
        number: "",
      };
    }

    return {
      heading: locale.startsWith("fr") ? "Paiement par carte" : "Card payment",
      instructions: locale.startsWith("fr")
        ? "Vous serez redirigé vers une page sécurisée pour finaliser le paiement par carte."
        : "You will be redirected to a secure page to complete card payment.",
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

async function createStripeCheckoutSession(
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  returnBaseUrl: string,
) {
  const content = await getElixirContent();
  const stripe = getStripeClient();
  const successUrl = `${getConfirmationUrl(order.confirmation_token, returnBaseUrl)}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = getCheckoutCancelUrl(order.confirmation_token, returnBaseUrl);
  const image = content.images.at(0);
  const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
    description: t(content.product.description, input.locale),
    name: t(content.product.name, input.locale),
  };

  if (image) {
    const imageUrl = getAssetUrl(image.src, returnBaseUrl);
    // Stripe only accepts publicly reachable HTTPS product images.
    if (imageUrl.startsWith("https://")) {
      productData.images = [imageUrl];
    }
  }

  const inlinePrice = resolveStripeInlinePrice(content);
  const priceId = env.STRIPE_HAIR_ELIXIR_PRICE_ID?.trim();
  const subscriptionPriceId = env.STRIPE_HAIR_ELIXIR_SUBSCRIPTION_PRICE_ID?.trim();
  const isSubscription = input.subscribe === true;

  if (priceId) {
    assertStripePriceId(priceId, "STRIPE_HAIR_ELIXIR_PRICE_ID");
  }

  const sharedMetadata = {
    order_id: order.id,
    order_number: order.order_number,
    product: content.id,
    storefront_currency: content.currency,
    storefront_total_xaf: String(content.priceCents * input.quantity),
  };

  let sessionParams: Stripe.Checkout.SessionCreateParams;

  if (isSubscription) {
    // Subscriptions require a real Stripe Dashboard Price (recurring price_data
    // is not offered here — keeps this path simple and matches the one price
    // Maison Fondjo actually sells today).
    if (!subscriptionPriceId) {
      throw new AppError(
        "BAD_REQUEST",
        "Subscriptions are not configured yet. Set STRIPE_HAIR_ELIXIR_SUBSCRIPTION_PRICE_ID in Vercel and redeploy.",
      );
    }

    assertStripePriceId(subscriptionPriceId, "STRIPE_HAIR_ELIXIR_SUBSCRIPTION_PRICE_ID");

    sessionParams = {
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      cancel_url: cancelUrl,
      line_items: [
        {
          price: subscriptionPriceId,
          quantity: input.quantity,
        },
      ],
      locale: input.locale.startsWith("fr") ? "fr" : "en",
      metadata: sharedMetadata,
      mode: "subscription",
      // Session-level metadata does not carry onto the Subscription object —
      // set it again here so webhook handlers can look up the order by id.
      subscription_data: {
        metadata: sharedMetadata,
      },
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["CM", "US", "CA", "FR", "GB", "BE", "DE", "NG", "GH"],
      },
      success_url: successUrl,
    };
  } else {
    sessionParams = {
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      cancel_url: cancelUrl,
      line_items: [
        priceId
          ? {
              price: priceId,
              quantity: input.quantity,
            }
          : {
              price_data: {
                currency: inlinePrice.currency,
                product_data: productData,
                unit_amount: inlinePrice.unit_amount,
              },
              quantity: input.quantity,
            },
      ],
      locale: input.locale.startsWith("fr") ? "fr" : "en",
      metadata: sharedMetadata,
      mode: "payment",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["CM", "US", "CA", "FR", "GB", "BE", "DE", "NG", "GH"],
      },
      success_url: successUrl,
    };
  }

  if (input.email) {
    sessionParams.customer_email = input.email;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      throw new AppError(
        "BAD_REQUEST",
        "Stripe did not return a checkout URL. Check STRIPE_SECRET_KEY and price settings in Vercel.",
      );
    }

    return session;
  } catch (error) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to start card checkout with Stripe.";

    logger.error("Stripe Checkout Session create failed.", {
      message,
      orderId: order.id,
      orderNumber: order.order_number,
      priceId: priceId || null,
      returnBaseUrl,
    });

    throw new AppError(
      "BAD_REQUEST",
      message.includes("Invalid API Key")
        ? "Stripe secret key is invalid. Update STRIPE_SECRET_KEY in Vercel and redeploy."
        : message,
    );
  }
}

async function createProviderCheckout(
  supabase: SupabaseClient,
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  provider: PaymentProviderDescriptor,
  _content: ElixirContent,
  returnBaseUrl: string,
) {
  if (provider.redirectProcessor === "stripe") {
    const session = await createStripeCheckoutSession(order, input, returnBaseUrl);
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);
    return session.url;
  }

  // Future: handle provider.redirectProcessor === "mobile_money" here.
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

  const amountCents =
    provider.kind === "redirect"
      ? content.priceCents * input.quantity
      : parseXafAmount(content.product.priceXaf) * input.quantity;

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
  const content = await getElixirContent();
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
      `${provider.defaultLabel} is not available yet. Please pay by card or contact Maison Fondjo on WhatsApp.`,
    );
  }

  if (input.subscribe) {
    if (provider.redirectProcessor !== "stripe") {
      throw new AppError(
        "BAD_REQUEST",
        "Subscriptions are only available with card payment. Choose Card to subscribe.",
      );
    }

    if (!customerId) {
      throw new AppError(
        "UNAUTHORIZED",
        "Sign in to your Maison Fondjo account to start a subscription.",
      );
    }
  }

  if (provider.redirectProcessor === "stripe") {
    getStripeClient();
  }

  const unitCents = parseXafAmount(content.product.priceXaf);
  const subtotalCents = unitCents * input.quantity;

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
      subtotal_cents: subtotalCents,
      total_cents: subtotalCents,
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
  const totalLabel = `${parseXafAmount(content.product.priceXaf) * input.quantity} XAF`;
  const profileId = await resolveProfileIdForCustomer(supabase, customerId);

  await queueOrderNotifications({
    city: input.city,
    confirmationUrl,
    customerName: input.name,
    kind: "placed",
    locale,
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
      content,
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
    "Mobile money payment is not available yet. Please pay by card or contact Maison Fondjo on WhatsApp.",
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

export async function fulfillStripeOrder(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
) {
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new AppError("BAD_REQUEST", "Stripe session is missing order metadata.");
  }

  if (session.payment_status !== "paid") {
    throw new AppError("BAD_REQUEST", "Stripe session is not paid.");
  }

  const { data: order, error: loadError } = await supabase
    .from("orders")
    .select("id, order_number, status, currency, total_cents, customer_id")
    .eq("id", orderId)
    .maybeSingle<{
      currency: string;
      customer_id: string | null;
      id: string;
      order_number: string;
      status: string;
      total_cents: number;
    }>();

  if (loadError || !order) {
    throw new AppError("BAD_REQUEST", loadError?.message ?? "Order not found for Stripe session.");
  }

  // When currencies align, reject overcharges. Discounts may lower amount_total.
  if (
    session.amount_total != null &&
    session.currency &&
    session.currency.toLowerCase() === order.currency.toLowerCase() &&
    session.amount_total > order.total_cents
  ) {
    throw new AppError(
      "BAD_REQUEST",
      `Stripe amount ${session.amount_total} exceeds order total ${order.total_cents}.`,
    );
  }

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
      status: "confirmed",
      status_updated_at: now,
      estimated_delivery_start: deliveryWindow.start,
      estimated_delivery_end: deliveryWindow.end,
      stripe_checkout_session_id: session.id,
      ...(session.customer_details?.email ? { email: session.customer_details.email } : {}),
    })
    .eq("id", orderId);

  if (orderError) {
    throw new AppError("BAD_REQUEST", orderError.message);
  }

  await supabase.from("order_status_events").insert({
    from_status: order.status,
    order_id: orderId,
    to_status: "confirmed",
  });

  await supabase
    .from("payments")
    .update({
      captured_at: now,
      provider_payment_id: session.payment_intent?.toString() ?? session.id,
      status: "succeeded",
    })
    .eq("order_id", orderId)
    .eq("provider", "stripe");

  await writeAuditLog(supabase, {
    action: "payment.confirmed.stripe",
    afterData: {
      amount_total: session.amount_total,
      currency: session.currency,
      order_number: order.order_number,
      payment_status: session.payment_status,
      stripe_session_id: session.id,
    },
    beforeData: { status: order.status },
    entityId: orderId,
    entityTable: "orders",
  });

  await notifyOrderConfirmed(supabase, orderId);

  if (session.mode === "subscription" && typeof session.subscription === "string") {
    await syncSubscriptionFromStripe(supabase, session.subscription, {
      customerId: order.customer_id,
      orderId,
    });
  }
}

/**
 * Maps Stripe's subscription lifecycle onto the narrower DB enum
 * (`active | paused | cancelled | past_due`). This checkout flow never
 * configures a trial, so in practice we only ever persist "active" here —
 * `incomplete`/`unpaid` fold into "past_due" (needs attention) rather than a
 * silent default, and `customer.subscription.updated` keeps status current
 * afterwards.
 */
function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "paused":
      return "paused";
    case "canceled":
      return "cancelled";
    case "past_due":
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
    default:
      return "past_due";
  }
}

/**
 * Upserts the local `subscriptions` row from the source-of-truth Stripe
 * object. Called right after `checkout.session.completed` (first billing
 * cycle) and again from `customer.subscription.updated` /
 * `customer.subscription.deleted` webhooks.
 */
async function syncSubscriptionFromStripe(
  supabase: SupabaseClient,
  stripeSubscriptionId: string,
  context: { customerId: string | null; orderId: string },
) {
  if (!context.customerId) {
    // `subscriptions.customer_id` is NOT NULL — a subscription must belong to
    // a signed-in account. createOneProductOrder() already rejects
    // subscribe=true for guests, so reaching this means something upstream
    // changed; log loudly instead of failing the webhook (order is still valid).
    logger.error("Stripe subscription confirmed without a linked customer_id — cannot persist.", {
      orderId: context.orderId,
      stripeSubscriptionId,
    });
    return;
  }

  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const item = subscription.items.data[0];
  const interval = item?.price.recurring?.interval;

  const { error } = await supabase.from("subscriptions").upsert(
    {
      amount_cents: item?.price.unit_amount ?? null,
      billing_interval: interval === "year" ? "year" : interval === "week" ? "month" : "month",
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      currency: subscription.currency.toUpperCase(),
      current_period_end: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null,
      customer_id: context.customerId,
      metadata: subscription.metadata ?? {},
      order_id: context.orderId,
      price_id: item?.price.id ?? null,
      quantity: item?.quantity ?? 1,
      status: mapStripeSubscriptionStatus(subscription.status),
      stripe_customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      stripe_subscription_id: subscription.id,
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  await writeAuditLog(supabase, {
    action: "subscription.synced",
    afterData: { status: subscription.status, stripe_subscription_id: subscription.id },
    entityId: context.orderId,
    entityTable: "subscriptions",
  });
}

/**
 * Handles `customer.subscription.updated` / `customer.subscription.deleted`.
 * The order this subscription originated from may not be known to this event
 * (Stripe does not echo session-level metadata onto later subscription
 * events), so this updates by `stripe_subscription_id` alone and is a no-op
 * if we have never seen this subscription (keeps webhook idempotent/safe).
 */
export async function syncSubscriptionStatus(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
) {
  const item = subscription.items.data[0];

  const { data: existing, error: lookupError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle<{ id: string }>();

  if (lookupError) {
    throw new AppError("BAD_REQUEST", lookupError.message);
  }

  if (!existing) {
    // Nothing local to update yet (e.g. event arrived before checkout.session.completed
    // finished processing) — safe to ignore, syncSubscriptionFromStripe will catch up.
    return;
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      current_period_end: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null,
      paused_at: subscription.status === "paused" ? new Date().toISOString() : null,
      status: mapStripeSubscriptionStatus(subscription.status),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  await writeAuditLog(supabase, {
    action: "subscription.status_updated",
    afterData: { status: subscription.status, stripe_subscription_id: subscription.id },
    entityId: existing.id,
    entityTable: "subscriptions",
  });
}

/**
 * Handles `invoice.paid` for `billing_reason === "subscription_cycle"`
 * (renewals only — the first cycle is already fulfilled by
 * `checkout.session.completed`). Creates a new order/payment pair from the
 * subscription's originating order so each shipment shows in Account →
 * Orders and triggers the same admin/customer notification pipeline.
 */
export async function createSubscriptionRenewalOrder(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice,
) {
  const subscriptionRef = invoice.parent?.subscription_details?.subscription;
  const stripeSubscriptionId =
    typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;

  if (!stripeSubscriptionId) {
    return;
  }

  const { data: subscriptionRow, error: subError } = await supabase
    .from("subscriptions")
    .select("order_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle<{ order_id: string | null }>();

  if (subError) {
    throw new AppError("BAD_REQUEST", subError.message);
  }

  if (!subscriptionRow?.order_id) {
    logger.error("Subscription renewal invoice has no matching local subscription/order.", {
      stripeSubscriptionId,
    });
    return;
  }

  const { data: sourceOrder, error: orderError } = await supabase
    .from("orders")
    .select(
      "billing_address, currency, customer_id, customer_name, customer_phone, delivery_address, delivery_city, email, metadata, shipping_address",
    )
    .eq("id", subscriptionRow.order_id)
    .maybeSingle();

  if (orderError) {
    throw new AppError("BAD_REQUEST", orderError.message);
  }

  if (!sourceOrder) {
    logger.error("Source order for subscription renewal no longer exists.", {
      orderId: subscriptionRow.order_id,
      stripeSubscriptionId,
    });
    return;
  }

  const sourceMetadata: Record<string, unknown> =
    sourceOrder.metadata && typeof sourceOrder.metadata === "object"
      ? (sourceOrder.metadata as Record<string, unknown>)
      : {};
  const amountCents = invoice.amount_paid ?? 0;
  const quantity = Number(sourceMetadata.quantity) || 1;
  const productName =
    typeof sourceMetadata.product_name === "string" ? sourceMetadata.product_name : "Sève Racine";

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
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: stripeSubscriptionId,
      },
      order_number: createOrderNumber(),
      payment_method: "stripe",
      placed_at: new Date().toISOString(),
      shipping_address: sourceOrder.shipping_address,
      status: "confirmed",
      subtotal_cents: amountCents,
      total_cents: amountCents,
    })
    .select("id, order_number, total_cents, confirmation_token")
    .single<CreatedOrderRow>();

  if (insertError || !newOrder) {
    throw new AppError(
      "BAD_REQUEST",
      insertError?.message ?? "Failed to record subscription renewal order.",
    );
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    metadata: { source: "subscription_renewal" },
    order_id: newOrder.id,
    quantity,
    title: productName,
    total_cents: amountCents,
    unit_price_cents: Math.round(amountCents / quantity),
    variant_title: "100ml",
  });

  if (itemError) {
    throw new AppError("BAD_REQUEST", itemError.message);
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    amount_cents: amountCents,
    captured_at: new Date().toISOString(),
    currency: (invoice.currency ?? sourceOrder.currency).toUpperCase(),
    metadata: { stripe_invoice_id: invoice.id },
    order_id: newOrder.id,
    provider: "stripe",
    provider_payment_id: invoice.id ?? `invoice_${stripeSubscriptionId}_${invoice.period_end}`,
    status: "succeeded",
  });

  if (paymentError) {
    throw new AppError("BAD_REQUEST", paymentError.message);
  }

  await supabase
    .from("subscriptions")
    .update({
      current_period_end: invoice.period_end
        ? new Date(invoice.period_end * 1000).toISOString()
        : null,
      order_id: newOrder.id,
      status: "active",
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  await writeAuditLog(supabase, {
    action: "subscription.renewed",
    afterData: { amount_cents: amountCents, order_number: newOrder.order_number },
    entityId: newOrder.id,
    entityTable: "orders",
  });

  await notifyOrderConfirmed(supabase, newOrder.id);
}
