import type { Metadata, Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUserIsAdmin } from "@/lib/auth/rbac";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { getOrderStatus } from "@/lib/order-status/registry";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import { getAccountOverview } from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.dashboard.metaTitle };
}

export default async function AccountHomePage() {
  const locale = await getServerLocale();
  const d = getDictionary(locale).account.dashboard;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const overview = await getAccountOverview(supabase, user!.id, locale);
  const isAdmin = await getCurrentUserIsAdmin();
  const firstName = overview.account.firstName ?? d.welcomeFallback;
  const latest = overview.latestOrder;

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {d.welcome.replace("{name}", firstName)}
        </Heading>
        <Text className="mt-2" tone="muted">
          {d.subtitle}
        </Text>
      </div>

      {isAdmin ? (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{d.adminCard}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/68">{d.adminCardBody}</p>
          </CardContent>
          <CardFooter>
            <Link className="text-sm font-semibold text-accent" href={"/admin" as Route}>
              {d.openAdmin}
            </Link>
          </CardFooter>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {d.activeOrders}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold">{overview.activeOrdersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {d.lastStatus}
            </p>
            <p className="mt-2 text-base font-semibold">
              {latest?.statusLabel ?? d.noActiveStatus}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {d.quickLinks}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {latest ? (
                <Link
                  className="text-sm font-semibold text-accent"
                  href={`/account/orders/${latest.id}`}
                >
                  {d.trackOrder}
                </Link>
              ) : null}
              <Link className="text-sm font-semibold text-accent" href={"/shop" as Route}>
                {d.shop}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{d.currentOrder}</CardTitle>
          </CardHeader>
          <CardContent>
            {latest ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">{latest.orderNumber}</span>
                  <Badge tone={getOrderStatus(latest.status).tone}>{latest.statusLabel}</Badge>
                </div>
                <p className="text-sm text-foreground/68">
                  {formatMoney(latest.totalCents, latest.currency)}, {latest.itemsCount}{" "}
                  {latest.itemsCount === 1 ? d.itemsOne : d.itemsMany}
                </p>
                <p className="text-xs text-foreground/55">{latest.paymentStatusLabel}</p>
              </div>
            ) : (
              <p className="text-sm text-foreground/68">{d.noOrder}</p>
            )}
          </CardContent>
          <CardFooter>
            {latest ? (
              <Link
                className="text-sm font-semibold text-accent"
                href={`/account/orders/${latest.id}`}
              >
                {d.viewOrder}
              </Link>
            ) : (
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                href={"/shop" as Route}
              >
                {d.orderSeve}
              </Link>
            )}
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{d.recentNotifications}</CardTitle>
          </CardHeader>
          <CardContent>
            {overview.recentNotifications.length === 0 ? (
              <p className="text-sm text-foreground/68">{d.noNotifications}</p>
            ) : (
              <ul className="grid gap-3">
                {overview.recentNotifications.map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-foreground/60">{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Link className="text-sm font-semibold text-accent" href="/account/notifications">
              {d.viewAllNotifications}
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{d.accountCompletion}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/68">
              {d.percentComplete.replace("{percent}", String(overview.profileCompletionPercent))}
              {overview.profileCompletionPercent < 100 ? d.addPhoneAddress : null}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${overview.profileCompletionPercent}%` }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Link className="text-sm font-semibold text-accent" href="/account/profile">
              {d.completeProfile}
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{d.buyAgain}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/68">{d.buyAgainBody}</p>
          </CardContent>
          <CardFooter>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
              href={"/shop" as Route}
            >
              {d.orderAgain}
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{d.securityCard}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">{d.securityBody}</p>
        </CardContent>
        <CardFooter>
          <Link className="text-sm font-semibold text-accent" href="/account/security">
            {d.openSecurity}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
