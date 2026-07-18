import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import { getAccountOverview } from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.dashboard.metaTitle };
}

function getOrderStatusTone(status: string) {
  return status === "confirmed" || status === "delivered" ? "sage" : "accent";
}

export default async function AccountHomePage() {
  const locale = await getServerLocale();
  const d = getDictionary(locale).account.dashboard;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const overview = await getAccountOverview(supabase, user!.id);
  const firstName = overview.account.firstName ?? d.welcomeFallback;

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

      <div className="grid gap-6 sm:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{d.currentOrder}</CardTitle>
          </CardHeader>
          <CardContent>
            {overview.latestOrder ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{overview.latestOrder.orderNumber}</span>
                  <Badge tone={getOrderStatusTone(overview.latestOrder.status)}>
                    {overview.latestOrder.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/68">
                  {formatMoney(overview.latestOrder.totalCents, overview.latestOrder.currency)} ·{" "}
                  {overview.latestOrder.itemsCount}{" "}
                  {overview.latestOrder.itemsCount === 1 ? d.itemsOne : d.itemsMany}
                </p>
              </div>
            ) : (
              <p className="text-sm text-foreground/68">{d.noOrder}</p>
            )}
          </CardContent>
          <CardFooter>
            {overview.latestOrder ? (
              <Link
                className="text-sm font-semibold text-accent"
                href={`/account/orders/${overview.latestOrder.id}`}
              >
                {d.viewOrder}
              </Link>
            ) : (
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                href="/#order"
              >
                {d.orderSeve}
              </Link>
            )}
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{d.accountCompletion}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${overview.profileCompletionPercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-foreground/68">
              {d.percentComplete.replace("{percent}", String(overview.profileCompletionPercent))}
              {overview.profileCompletionPercent < 100 ? d.addPhoneAddress : "."}
            </p>
          </CardContent>
          <CardFooter>
            <Link className="text-sm font-semibold text-accent" href="/account/profile">
              {d.completeProfile}
            </Link>
          </CardFooter>
        </Card>
      </div>

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
            href="/#order"
          >
            {d.orderAgain}
          </Link>
        </CardFooter>
      </Card>

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
