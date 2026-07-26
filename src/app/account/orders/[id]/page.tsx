import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { OrderStatusTimeline } from "@/features/account/components/order-status-timeline";
import { getDictionary } from "@/i18n/dictionaries";
import { AppError } from "@/lib/errors/app-error";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { canDownloadAccountReceipt } from "@/lib/order-status/account-facets";
import { getOrderStatus } from "@/lib/order-status/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import {
  getOrCreateCustomerAccount,
  getOrderForCustomer,
} from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.orders.detailMeta };
}

function formatDeliveryWindow(
  start: string | null,
  end: string | null,
  locale: string,
  fallback: string,
) {
  if (!start || !end) return fallback;
  const fmt = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const locale = await getServerLocale();
  const o = getDictionary(locale).account.orders;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);

  const order = await getOrderForCustomer(supabase, account.id, id, locale).catch((error) => {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  });

  if (!order) {
    notFound();
  }

  const statusMeta = getOrderStatus(order.status);
  const showReceipt = canDownloadAccountReceipt(order.status);

  return (
    <div className="grid gap-6">
      <div>
        <Link className="text-sm font-semibold text-accent" href="/account/orders">
          {o.backToOrders}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Heading as="h1" level="h2">
            {order.orderNumber}
          </Heading>
          <Badge tone={statusMeta.tone}>{order.statusLabel}</Badge>
          <Badge
            tone={
              order.paymentStatus === "paid"
                ? "sage"
                : order.paymentStatus === "pending"
                  ? "warning"
                  : "neutral"
            }
          >
            {order.paymentStatusLabel}
          </Badge>
        </div>
        <Text className="mt-2" tone="muted">
          {o.placed}{" "}
          {new Date(order.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-background"
            href={"/shop" as Route}
          >
            {o.buyAgain}
          </Link>
          {showReceipt ? (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground"
              href={`/account/orders/${order.id}/receipt`}
            >
              {o.viewReceipt}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{o.timeline}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusTimeline steps={order.timeline} />
            <p className="mt-4 text-sm text-foreground/68">
              <span className="font-semibold text-foreground">{o.estimatedDelivery}: </span>
              {formatDeliveryWindow(
                order.estimatedDeliveryStart,
                order.estimatedDeliveryEnd,
                locale,
                o.estimatedDeliveryPending,
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{o.delivery}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/78">{order.deliveryCity ?? o.notSet}</p>
            <p className="mt-1 text-sm leading-6 text-foreground/68">
              {order.deliveryAddress ?? o.notSet}
            </p>
            {order.trackingUrl ? (
              <a
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                href={order.trackingUrl}
              >
                <Icons.package aria-hidden="true" className="h-4 w-4" /> {o.viewDetails}
              </a>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{o.items}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {order.items.map((item) => (
              <div className="flex items-center justify-between gap-3" key={item.id}>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.variantTitle ? (
                    <p className="text-xs text-foreground/58">{item.variantTitle}</p>
                  ) : null}
                  <p className="text-xs text-foreground/58">Qty {item.quantity}</p>
                </div>
                <span className="font-mono text-sm">
                  {formatMoney(item.totalCents, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{o.payment}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/78">{order.paymentMethod ?? o.notSet}</p>
          <p className="mt-1 text-xs text-foreground/58">
            {o.paymentStatus}: {order.paymentStatusLabel}
          </p>
          {order.manualPaymentReference ? (
            <p className="mt-1 text-xs text-foreground/58">
              {o.reference}: {order.manualPaymentReference}
            </p>
          ) : null}
          <p className="mt-3 font-mono text-sm font-semibold">
            {formatMoney(order.totalCents, order.currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
