import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { getOrderByConfirmationToken } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Review your FONDJO order confirmation and payment verification status.",
  robots: {
    follow: false,
    index: false,
  },
  title: "Order Confirmation | FONDJO",
};

type ConfirmationPageProps = {
  searchParams: Promise<{
    checkout?: string;
    session_id?: string;
    token?: string;
  }>;
};

function formatAmount(amount: number, currency: string) {
  if (currency === "XAF") {
    return `${amount.toLocaleString("en-US")} XAF`;
  }

  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount / 100);
}

function readInstructionValue(instructions: unknown, key: string) {
  if (!instructions || typeof instructions !== "object" || Array.isArray(instructions)) {
    return "";
  }

  const value = Reflect.get(instructions, key);

  return typeof value === "string" ? value : "";
}

function getStatusTone(status: string) {
  return status === "confirmed" || status === "delivered" ? "sage" : "accent";
}

function getStatusMessage(status: string) {
  switch (status) {
    case "pending_payment":
      return "Your order is created. Send payment using the instructions below, then submit your transaction reference through the order support flow or WhatsApp.";
    case "payment_submitted":
      return "Your payment reference was received and is waiting for admin verification.";
    case "confirmed":
      return "Your payment is confirmed. The order will move to packing before shipment.";
    case "packed":
      return "Your order is packed and waiting for shipment.";
    case "shipped":
      return "Your order has shipped.";
    case "delivered":
      return "Your order is marked delivered.";
    case "cancelled":
      return "This order has been cancelled.";
    case "refunded":
      return "This order has been refunded.";
    default:
      return "We received your FONDJO order. Manual Mobile Money orders are verified by the admin team before confirmation.";
  }
}

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;

  if (!params.token) {
    return (
      <main className="min-h-screen bg-background py-16">
        <Container size="sm">
          <Card variant="elevated">
            <Kicker>Order confirmation</Kicker>
            <Heading as="h1" className="mt-3" level="h2">
              Confirmation link missing
            </Heading>
            <Text className="mt-4" tone="muted">
              Please return to your FONDJO order flow or WhatsApp support for help finding your
              confirmation.
            </Text>
            <Link className="mt-6 inline-flex text-sm font-semibold text-accent" href="/">
              Return home
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  const supabase = getSupabaseAdminClient();
  const order = await getOrderByConfirmationToken(supabase, params.token);
  const instructionLabel = readInstructionValue(order.payment_instructions, "label");
  const instructionNumber = readInstructionValue(order.payment_instructions, "number");
  const instructionText = readInstructionValue(order.payment_instructions, "instructions");

  return (
    <main className="min-h-screen bg-background py-16">
      <Container size="md">
        <Card variant="elevated">
          <Badge tone={getStatusTone(order.status)}>{order.status}</Badge>
          <Kicker className="mt-6">Order confirmation</Kicker>
          <Heading as="h1" className="mt-3" level="h2">
            {order.order_number}
          </Heading>
          <Text className="mt-4" tone="muted">
            {getStatusMessage(order.status)}
          </Text>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Customer
              </p>
              <p className="mt-2 font-semibold">{order.customer_name}</p>
              <p className="mt-1 text-sm text-foreground/62">{order.customer_phone}</p>
            </div>
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Total</p>
              <p className="mt-2 font-mono font-semibold">
                {formatAmount(order.total_cents, order.currency)}
              </p>
              <p className="mt-1 text-sm text-foreground/62">{order.payment_method}</p>
            </div>
            <div className="rounded-md bg-surface-muted p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Delivery
              </p>
              <p className="mt-2 font-semibold">{order.delivery_city}</p>
              <p className="mt-1 text-sm leading-6 text-foreground/68">{order.delivery_address}</p>
            </div>
          </div>

          {instructionLabel ? (
            <div className="mt-6 rounded-lg border border-border bg-surface p-5">
              <p className="font-semibold">{instructionLabel}</p>
              {instructionNumber ? <p className="mt-2 font-mono">{instructionNumber}</p> : null}
              {order.manual_payment_reference ? (
                <p className="mt-2 text-sm text-foreground/62">
                  Reference: {order.manual_payment_reference}
                </p>
              ) : null}
              {instructionText ? (
                <p className="mt-4 text-sm leading-6 text-foreground/68">{instructionText}</p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
              href="/#order"
            >
              Place another order
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold"
              href="/"
            >
              Return home
            </Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}
