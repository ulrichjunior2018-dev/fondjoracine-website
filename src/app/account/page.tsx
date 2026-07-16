import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import { getAccountOverview } from "@/services/customer/customer-service";

export const metadata: Metadata = { title: "Home" };

function getOrderStatusTone(status: string) {
  return status === "confirmed" || status === "delivered" ? "sage" : "accent";
}

export default async function AccountHomePage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  // `user` is guaranteed by the layout guard; the non-null assertion here is
  // scoped to this already-authenticated request.
  const overview = await getAccountOverview(supabase, user!.id);
  const firstName = overview.account.firstName ?? "there";

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          Welcome back, {firstName}
        </Heading>
        <Text className="mt-2" tone="muted">
          Here&apos;s what&apos;s happening with your Maison Fondjo account.
        </Text>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Current order</CardTitle>
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
                  {overview.latestOrder.itemsCount} item
                  {overview.latestOrder.itemsCount === 1 ? "" : "s"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-foreground/68">
                You haven&apos;t placed an order yet. Sève Racine is waiting for you.
              </p>
            )}
          </CardContent>
          <CardFooter>
            {overview.latestOrder ? (
              <Link
                className="text-sm font-semibold text-accent"
                href={`/account/orders/${overview.latestOrder.id}`}
              >
                View order →
              </Link>
            ) : (
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                href="/#order"
              >
                Order Sève Racine
              </Link>
            )}
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Account completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${overview.profileCompletionPercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-foreground/68">
              {overview.profileCompletionPercent}% complete
              {overview.profileCompletionPercent < 100 ? " — add a phone number and address." : "."}
            </p>
          </CardContent>
          <CardFooter>
            <Link className="text-sm font-semibold text-accent" href="/account/profile">
              Complete your profile →
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buy again</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">
            Restock your Sève Racine hair oil — recommended 2–4 times a week for best results.
          </p>
        </CardContent>
        <CardFooter>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
            href="/#order"
          >
            Order again
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
