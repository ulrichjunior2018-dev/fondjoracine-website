import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { AdminLockedState } from "@/features/admin/components/admin-locked-state";
import { AdminOrdersTable } from "@/features/admin/components/admin-orders-table";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { listAdminOrders } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Orders | FONDJO",
};

export default async function AdminOrdersPage() {
  const access = await requireAdminPermission(adminPermissions.ordersRead).catch(() => null);

  if (!access) {
    return (
      <AdminLockedState message="Sign in with an authorized admin account to manage orders." />
    );
  }

  const orders = await listAdminOrders(access.supabase);

  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <Kicker>Admin</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Order management
        </Heading>
        <Text className="mt-4 max-w-3xl" tone="muted">
          Review one-product orders, verify MTN MoMo and Orange Money references manually, and move
          orders into the next fulfillment state.
        </Text>
        <div className="mt-8">
          <AdminOrdersTable orders={orders} />
        </div>
      </Container>
    </main>
  );
}
