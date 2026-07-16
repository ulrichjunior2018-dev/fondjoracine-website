import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils/currency";
import {
  getOrCreateCustomerAccount,
  listOrdersForCustomer,
} from "@/services/customer/customer-service";

export const metadata: Metadata = { title: "My Orders" };

function getStatusTone(status: string) {
  return status === "confirmed" || status === "delivered" ? "sage" : "accent";
}

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const orders = await listOrdersForCustomer(supabase, account.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          My Orders
        </Heading>
        <Text className="mt-2" tone="muted">
          Every order you&apos;ve placed with Maison Fondjo.
        </Text>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-sm text-foreground/68">No orders yet.</p>
            <Link className="mt-3 inline-block text-sm font-semibold text-accent" href="/#order">
              Place your first order →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <Link href={`/account/orders/${order.id}`} key={order.id}>
              <Card className="transition-colors hover:border-border-strong">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-foreground/58">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold">
                      {formatMoney(order.totalCents, order.currency)}
                    </span>
                    <Badge tone={getStatusTone(order.status)}>
                      {order.status.replace(/_/g, " ")}
                    </Badge>
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
