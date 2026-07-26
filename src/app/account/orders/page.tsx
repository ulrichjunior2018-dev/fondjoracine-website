import type { Metadata, Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { getOrderStatus } from "@/lib/order-status/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import {
  getOrCreateCustomerAccount,
  listOrdersForCustomer,
} from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.orders.metaTitle };
}

function formatEta(start: string | null, end: string | null, locale: string, pending: string) {
  if (!start || !end) return pending;
  const fmt = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default async function AccountOrdersPage() {
  const locale = await getServerLocale();
  const o = getDictionary(locale).account.orders;
  const d = getDictionary(locale).account.dashboard;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const orders = await listOrdersForCustomer(supabase, account.id, locale);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {o.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {o.subtitle}
        </Text>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-foreground/68">{o.empty}</p>
            <Link
              className="mt-3 inline-block text-sm font-semibold text-accent"
              href={"/shop" as Route}
            >
              {o.firstOrder}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <Link href={`/account/orders/${order.id}`} key={order.id}>
              <Card className="transition-colors hover:border-border-strong">
                <div className="grid gap-3 p-1 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-foreground/58">
                      {new Date(order.createdAt).toLocaleDateString(
                        locale === "fr" ? "fr-FR" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                      , {order.itemsCount} {order.itemsCount === 1 ? d.itemsOne : d.itemsMany}
                    </p>
                    <p className="mt-2 text-xs text-foreground/58">
                      {o.payment}: {order.paymentMethod ?? o.notSet}
                    </p>
                    <p className="mt-1 text-xs text-foreground/58">
                      {o.estimatedDelivery}:{" "}
                      {formatEta(
                        order.estimatedDeliveryStart,
                        order.estimatedDeliveryEnd,
                        locale,
                        o.estimatedDeliveryPending,
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="font-mono text-sm font-semibold">
                      {formatMoney(order.totalCents, order.currency)}
                    </span>
                    <div className="flex flex-wrap gap-2">
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
                      <Badge tone={getOrderStatus(order.status).tone}>{order.statusLabel}</Badge>
                    </div>
                    <span className="text-xs font-semibold text-accent">{o.viewDetails} →</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
