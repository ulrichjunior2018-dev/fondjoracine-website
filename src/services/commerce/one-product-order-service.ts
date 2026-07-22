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
import { AppError } from "@/lib/errors/app-error";
import { getConfiguredSiteUrl } from "@/lib/http/app-base-url";
import { logger } from "@/lib/logger/logger";
import { getPaymentProvider } from "@/lib/payments/registry";
import { getStripeClient } from "@/lib/payments/stripe";
import type { PaymentProviderDescriptor } from "@/lib/payments/types";
import { writeAuditLog } from "@/lib/security/audit-log";
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

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      product: content.id,
      storefront_currency: content.currency,
      storefront_total_xaf: String(content.priceCents * input.quantity),
    },
    mode: "payment",
    phone_number_collection: {
      enabled: true,
    },
    shipping_address_collection: {
      allowed_countries: ["CM", "US", "CA", "FR", "GB", "BE", "DE", "NG", "GH"],
    },
    success_url: successUrl,
  };

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

  const confirmationUrl = getConfirmationUrl(order.confirmation_token, returnBaseUrl);
  const totalLabel = `${parseXafAmount(content.product.priceXaf) * input.quantity} XAF`;

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
    totalLabel,
    ...(input.email ? { customerEmail: input.email } : {}),
    ...(customerId ? { customerId } : {}),
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
      "id, order_number, status, fulfillment_status, currency, total_cents, customer_name, customer_phone, delivery_city, payment_method, manual_payment_reference, created_at, admin_payment_verified_at",
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
    .select("id, order_number, status")
    .eq("id", orderId)
    .maybeSingle();

  const update: Record<string, unknown> = { status: input.status };

  if (input.status === "confirmed") {
    update.admin_payment_verified_at = new Date().toISOString();
    update.admin_payment_verified_by = adminProfileId;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select("id, order_number, status, admin_payment_verified_at")
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  if (input.status === "confirmed") {
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        captured_at: new Date().toISOString(),
        status: "succeeded",
      })
      .eq("order_id", orderId);

    if (paymentError) {
      throw new AppError("BAD_REQUEST", paymentError.message);
    }

    await notifyOrderConfirmed(supabase, orderId);
  }

  await writeAuditLog(supabase, {
    action: input.status === "confirmed" ? "payment.confirmed.admin" : "order.status_updated.admin",
    actorProfileId: adminProfileId,
    afterData: {
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

  await queueOrderNotifications({
    city: order.delivery_city ?? "Unknown",
    confirmationUrl: getConfirmationUrl(order.confirmation_token),
    customerName: order.customer_name ?? "Customer",
    kind: "confirmed",
    locale: order.metadata?.locale === "fr" ? "fr" : "en",
    orderNumber: order.order_number,
    paymentMethod: paymentLabel,
    phone: order.customer_phone ?? "Unknown",
    totalLabel: `${order.total_cents.toLocaleString("en-US")} XAF`,
    ...(order.email ? { customerEmail: order.email } : {}),
    ...(order.customer_id ? { customerId: order.customer_id } : {}),
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
    .select("id, order_number, status, currency, total_cents")
    .eq("id", orderId)
    .maybeSingle<{
      currency: string;
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

  if (order.status === "confirmed") {
    return;
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
      stripe_checkout_session_id: session.id,
      ...(session.customer_details?.email ? { email: session.customer_details.email } : {}),
    })
    .eq("id", orderId);

  if (orderError) {
    throw new AppError("BAD_REQUEST", orderError.message);
  }

  await supabase
    .from("payments")
    .update({
      captured_at: new Date().toISOString(),
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
}
