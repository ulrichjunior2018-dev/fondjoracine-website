import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { AppError } from "@/lib/errors/app-error";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
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

function getStatusTone(status: string) {
  return status === "confirmed" || status === "delivered" ? "sage" : "accent";
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

  const order = await getOrderForCustomer(supabase, account.id, id).catch((error) => {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  });

  if (!order) {
    notFound();
  }

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
          <Badge tone={getStatusTone(order.status)}>{order.status.replace(/_/g, " ")}</Badge>
        </div>
        <Text className="mt-2" tone="muted">
          {o.placed}{" "}
          {new Date(order.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{o.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/78">{order.paymentMethod ?? o.notSet}</p>
            {order.manualPaymentReference ? (
              <p className="mt-1 text-xs text-foreground/58">
                {o.detailMeta}: {order.manualPaymentReference}
              </p>
            ) : null}
            <p className="mt-3 font-mono text-sm font-semibold">
              {formatMoney(order.totalCents, order.currency)}
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
    </div>
  );
}
