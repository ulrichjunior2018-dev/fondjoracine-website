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
import { getStripeClient } from "@/lib/payments/stripe";
import { queueOrderNotifications } from "@/services/commerce/order-notification-service";
import type { SupabaseClient } from "@supabase/supabase-js";

type ManualPaymentMethod = Extract<OneProductPaymentMethod, "mtn_momo" | "orange_money">;

type CreatedOrderRow = {
  confirmation_token: string;
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
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

function getManualPaymentMethod(content: ElixirContent, method: ManualPaymentMethod) {
  const label = method === "mtn_momo" ? "MTN MoMo" : "Orange Money";
  const paymentMethod = content.manualPayments.methods.find((item) =>
    item.label.toLowerCase().includes(method === "mtn_momo" ? "mtn" : "orange"),
  );

  if (!paymentMethod) {
    throw new AppError("INTERNAL", `${label} payment instructions are not configured.`, {
      expose: false,
    });
  }

  return paymentMethod;
}

function getConfirmationUrl(token: string) {
  return `${env.NEXT_PUBLIC_SITE_URL}/order-confirmation?token=${token}`;
}

function getPaymentInstructions(
  content: ElixirContent,
  locale: Locale,
  method: OneProductPaymentMethod,
) {
  if (method === "whatsapp") {
    return {
      heading: t(content.whatsapp.label, locale),
      instructions: t(content.whatsapp.message, locale),
      label: "WhatsApp",
      number: content.whatsapp.phone,
    };
  }

  if (method === "stripe") {
    return {
      heading: "Stripe Checkout",
      instructions:
        locale === "fr"
          ? "Vous serez redirige vers Stripe pour finaliser le paiement par carte."
          : "You will be redirected to Stripe to complete card payment.",
      label: "Stripe",
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
) {
  const content = await getElixirContent();
  const stripe = getStripeClient();
  const successUrl = `${getConfirmationUrl(order.confirmation_token)}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${getConfirmationUrl(order.confirmation_token)}&checkout=cancelled`;
  const image = content.images.at(0);
  const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
    description: t(content.product.description, input.locale),
    name: t(content.product.name, input.locale),
  };

  if (image) {
    productData.images = [image.src];
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    cancel_url: cancelUrl,
    line_items: [
      env.STRIPE_HAIR_ELIXIR_PRICE_ID
        ? {
            price: env.STRIPE_HAIR_ELIXIR_PRICE_ID,
            quantity: input.quantity,
          }
        : {
            price_data: {
              currency: content.currency.toLowerCase(),
              product_data: productData,
              unit_amount: content.priceCents,
            },
            quantity: input.quantity,
          },
    ],
    locale: input.locale === "fr" ? "fr" : "en",
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      product: content.id,
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

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new AppError("INTERNAL", "Stripe did not return a checkout URL.", { expose: false });
  }

  return session;
}

async function recordPayment(
  supabase: SupabaseClient,
  order: CreatedOrderRow,
  input: CreateOneProductOrderInput,
  content: ElixirContent,
) {
  if (input.payment_method === "whatsapp") {
    return;
  }

  if (
    (input.payment_method === "mtn_momo" || input.payment_method === "orange_money") &&
    !input.transaction_reference
  ) {
    return;
  }

  const providerPaymentId =
    input.payment_method === "stripe"
      ? `stripe_checkout:${order.id}`
      : `${input.payment_method}:${input.transaction_reference}`;

  const { error } = await supabase.from("payments").insert({
    amount_cents:
      input.payment_method === "stripe"
        ? content.priceCents * input.quantity
        : parseXafAmount(content.product.priceXaf) * input.quantity,
    currency: input.payment_method === "stripe" ? content.currency : "XAF",
    metadata: {
      customer_phone: input.phone,
      manual_reference: input.transaction_reference || null,
      payment_method: input.payment_method,
    },
    order_id: order.id,
    provider: input.payment_method,
    provider_payment_id: providerPaymentId,
    status: input.payment_method === "stripe" ? "requires_confirmation" : "processing",
  });

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }
}

export async function createOneProductOrder(
  supabase: SupabaseClient,
  input: CreateOneProductOrderInput,
) {
  const content = await getElixirContent();
  const locale = input.locale;
  const instructions = getPaymentInstructions(content, locale, input.payment_method);
  const isManualPayment =
    input.payment_method === "mtn_momo" || input.payment_method === "orange_money";

  if (input.payment_method === "stripe") {
    getStripeClient();
  }

  const subtotalCents =
    input.payment_method === "stripe"
      ? content.priceCents * input.quantity
      : parseXafAmount(content.product.priceXaf) * input.quantity;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      billing_address: {
        city: input.city,
        country: input.payment_method === "stripe" ? null : "CM",
        line1: input.delivery_address,
        name: input.name,
        phone: normalizePhone(input.phone),
      },
      currency: input.payment_method === "stripe" ? content.currency : "XAF",
      customer_name: input.name,
      customer_phone: normalizePhone(input.phone),
      delivery_address: input.delivery_address,
      delivery_city: input.city,
      email: input.email || null,
      manual_payment_provider: isManualPayment ? instructions.label : null,
      manual_payment_reference: isManualPayment ? input.transaction_reference : null,
      metadata: {
        locale,
        notification_hooks: ["admin_email", "admin_whatsapp"],
        order_channel: "one_product_storefront",
        product_id: content.id,
        product_name: t(content.product.name, locale),
        quantity: input.quantity,
      },
      order_number: createOrderNumber(),
      payment_instructions: instructions,
      payment_method: input.payment_method,
      placed_at: new Date().toISOString(),
      shipping_address: {
        city: input.city,
        country: input.payment_method === "stripe" ? null : "CM",
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

  const confirmationUrl = getConfirmationUrl(order.confirmation_token);
  const totalLabel = `${parseXafAmount(content.product.priceXaf) * input.quantity} XAF`;

  await queueOrderNotifications({
    city: input.city,
    confirmationUrl,
    customerName: input.name,
    orderNumber: order.order_number,
    paymentMethod: instructions.label,
    phone: normalizePhone(input.phone),
    totalLabel,
    ...(input.transaction_reference ? { transactionReference: input.transaction_reference } : {}),
  });

  if (input.payment_method === "stripe") {
    const session = await createStripeCheckoutSession(order, input);
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return {
      checkoutUrl: session.url,
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

export async function submitOrderPaymentReference(
  supabase: SupabaseClient,
  token: string,
  input: SubmitPaymentReferenceInput,
) {
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, total_cents, customer_name, customer_phone, delivery_city, payment_method, confirmation_token",
    )
    .eq("confirmation_token", token)
    .single<
      CreatedOrderRow & {
        customer_name: string | null;
        customer_phone: string | null;
        delivery_city: string | null;
        payment_method: OneProductPaymentMethod | null;
      }
    >();

  if (error || !order) {
    throw new AppError("NOT_FOUND", "Order confirmation was not found.");
  }

  if (order.payment_method !== "mtn_momo" && order.payment_method !== "orange_money") {
    throw new AppError("BAD_REQUEST", "This order does not use manual Mobile Money payment.");
  }

  if (order.status === "confirmed" || order.status === "cancelled" || order.status === "refunded") {
    throw new AppError("BAD_REQUEST", "This order can no longer accept a payment reference.");
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      manual_payment_reference: input.transaction_reference,
      status: "payment_submitted",
    })
    .eq("id", order.id)
    .select("id, order_number, status, admin_payment_verified_at")
    .single();

  if (updateError) {
    throw new AppError("BAD_REQUEST", updateError.message);
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    amount_cents: order.total_cents,
    currency: "XAF",
    metadata: {
      manual_reference: input.transaction_reference,
      payment_method: order.payment_method,
    },
    order_id: order.id,
    provider: order.payment_method,
    provider_payment_id: `${order.payment_method}:${input.transaction_reference}`,
    status: "processing",
  });

  if (paymentError) {
    throw new AppError("BAD_REQUEST", paymentError.message);
  }

  await queueOrderNotifications({
    city: order.delivery_city ?? "Unknown",
    confirmationUrl: getConfirmationUrl(order.confirmation_token),
    customerName: order.customer_name ?? "Customer",
    orderNumber: order.order_number,
    paymentMethod: order.payment_method === "mtn_momo" ? "MTN MoMo" : "Orange Money",
    phone: order.customer_phone ?? "Unknown",
    totalLabel: `${order.total_cents.toLocaleString("en-US")} XAF`,
    transactionReference: input.transaction_reference,
  });

  return updatedOrder;
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
  }

  return data;
}

export async function fulfillStripeOrder(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
) {
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new AppError("BAD_REQUEST", "Stripe session is missing order metadata.");
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
      stripe_checkout_session_id: session.id,
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
}
