import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import type { PublicCopy } from "@/content/copy";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { getOrderStatus } from "@/lib/order-status/registry";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";
import { getOrderByConfirmationToken } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await buildPublicMetadata((publicCopy) => publicCopy.metadata.orderConfirmation);
  return {
    ...metadata,
    robots: {
      follow: false,
      index: false,
    },
  };
}

type ConfirmationPageProps = {
  searchParams: Promise<{
    checkout?: string;
    session_id?: string;
    token?: string;
  }>;
};

function formatAmount(amount: number, currency: string) {
  if (currency === "XAF") {
    return `${amount.toLocaleString("fr-FR")} XAF`;
  }

  return new Intl.NumberFormat("fr-FR", {
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
  return getOrderStatus(status).tone;
}

function getStatusMessage(status: string, publicCopy: PublicCopy) {
  const statusCopy = publicCopy.orderConfirmation.status as Record<string, string | undefined>;
  return statusCopy[status] ?? statusCopy.fallback ?? getOrderStatus(status).labelEn;
}

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { publicCopy } = await resolvePublicCopy();
  const params = await searchParams;

  if (!params.token) {
    return (
      <main className="min-h-screen bg-background py-16">
        <Container size="sm">
          <Card variant="elevated">
            <Kicker>{publicCopy.orderConfirmation.title}</Kicker>
            <Heading as="h1" className="mt-3" level="h2">
              {publicCopy.orderConfirmation.missing.title}
            </Heading>
            <Text className="mt-4" tone="muted">
              {publicCopy.orderConfirmation.missing.body}
            </Text>
            <Link className="mt-6 inline-flex text-sm font-semibold text-accent" href="/">
              {publicCopy.orderConfirmation.actions.backHome}
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
          <Kicker className="mt-6">{publicCopy.orderConfirmation.title}</Kicker>
          <Heading as="h1" className="mt-3" level="h2">
            {order.order_number}
          </Heading>
          <Text className="mt-4" tone="muted">
            {getStatusMessage(order.status, publicCopy)}
          </Text>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {publicCopy.orderConfirmation.customer}
              </p>
              <p className="mt-2 font-semibold">{order.customer_name}</p>
              <p className="mt-1 text-sm text-foreground/62">{order.customer_phone}</p>
            </div>
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {publicCopy.orderConfirmation.total}
              </p>
              <p className="mt-2 font-mono font-semibold">
                {formatAmount(order.total_cents, order.currency)}
              </p>
              <p className="mt-1 text-sm text-foreground/62">{order.payment_method}</p>
            </div>
            <div className="rounded-md bg-surface-muted p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {publicCopy.orderConfirmation.delivery}
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
                  {publicCopy.orderConfirmation.paymentReference}: {order.manual_payment_reference}
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
              {publicCopy.orderConfirmation.actions.newOrder}
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold"
              href="/"
            >
              {publicCopy.orderConfirmation.actions.backHome}
            </Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}
