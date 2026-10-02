import type { Metadata, Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { canDownloadAccountReceipt } from "@/lib/order-status/account-facets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import {
  getOrCreateCustomerAccount,
  listOrdersForCustomer,
} from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.billing.metaTitle };
}

export default async function AccountBillingPage() {
  const locale = await getServerLocale();
  const b = getDictionary(locale).account.billing;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const orders = await listOrdersForCustomer(supabase, account.id, locale);
  const paidOrders = orders.filter((order) => canDownloadAccountReceipt(order.status));

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {b.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {b.subtitle}
        </Text>
      </div>

      {paidOrders.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-foreground/68">{b.empty}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {paidOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                <div>
                  <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-foreground/58">
                    {b.date}:{" "}
                    {new Date(order.createdAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" },
                    )}
                  </p>
                  <p className="mt-1 text-xs text-foreground/58">
                    {b.paymentMethod}: {order.paymentMethod ?? "—"}
                  </p>
                  <div className="mt-2">
                    <Badge tone="sage">{order.paymentStatusLabel}</Badge>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="font-mono text-sm font-semibold">
                    {b.amount}: {formatMoney(order.totalCents, order.currency)}
                  </p>
                  <Link
                    className="text-sm font-semibold text-accent"
                    href={`/account/orders/${order.id}/receipt` as Route}
                  >
                    {b.receipt} →
                  </Link>
                  <Link
                    className="text-xs font-semibold text-foreground/60"
                    href={`/account/orders/${order.id}`}
                  >
                    {b.viewOrder}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
