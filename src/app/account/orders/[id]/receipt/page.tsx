import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Heading, Text } from "@/components/ui/typography";
import { PrintReceiptButton } from "@/features/account/components/print-receipt-button";
import { getDictionary } from "@/i18n/dictionaries";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { canDownloadAccountReceipt } from "@/lib/order-status/account-facets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import {
  getOrCreateCustomerAccount,
  getOrderForCustomer,
} from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.receipt.metaTitle };
}

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params;
  const locale = await getServerLocale();
  const r = getDictionary(locale).account.receipt;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);

  const order = await getOrderForCustomer(supabase, account.id, id, locale).catch((error) => {
    if (error instanceof AppError && error.code === "NOT_FOUND") return null;
    throw error;
  });

  if (!order || !canDownloadAccountReceipt(order.status)) {
    notFound();
  }

  const careEmail = env.RESEND_FROM_EMAIL || "care@maisonfondjo.com";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link className="text-sm font-semibold text-accent" href={`/account/orders/${order.id}`}>
          {r.back}
        </Link>
        <PrintReceiptButton label={r.print} />
      </div>

      <article className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <Heading as="h1" level="h2">
          {r.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {r.soldBy} · {order.orderNumber}
        </Text>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {r.billTo}
            </p>
            <p className="mt-2 text-sm">{order.customerName ?? account.email}</p>
            <p className="text-sm text-foreground/68">{order.email ?? account.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {r.shipTo}
            </p>
            <p className="mt-2 text-sm">{order.deliveryAddress ?? "—"}</p>
            <p className="text-sm text-foreground/68">{order.deliveryCity ?? ""}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
            {r.payment}
          </p>
          <p className="mt-2 text-sm">
            {order.paymentMethod ?? "—"} · {order.paymentStatusLabel}
          </p>
          {order.manualPaymentReference ? (
            <p className="mt-1 font-mono text-xs text-foreground/58">
              {order.manualPaymentReference}
            </p>
          ) : null}
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
            {r.items}
          </p>
          <div className="mt-3 grid gap-2 border-t border-border pt-3">
            {order.items.map((item) => (
              <div className="flex items-center justify-between gap-3 text-sm" key={item.id}>
                <span>
                  {item.title}
                  {item.variantTitle ? ` · ${item.variantTitle}` : ""} × {item.quantity}
                </span>
                <span className="font-mono">{formatMoney(item.totalCents, order.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">{r.total}</span>
            <span className="font-mono text-lg font-semibold">
              {formatMoney(order.totalCents, order.currency)}
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm text-foreground/68">
          {r.thankYou}{" "}
          <a className="font-semibold text-accent" href={`mailto:${careEmail}`}>
            {careEmail}
          </a>
        </p>

        <p className="mt-4 print:hidden">
          <Link className="text-sm font-semibold text-accent" href={"/shop" as Route}>
            ← Shop
          </Link>
        </p>
      </article>
    </div>
  );
}
