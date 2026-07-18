import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { AdminLockedState } from "@/features/admin/components/admin-locked-state";
import { AdminOrdersTable } from "@/features/admin/components/admin-orders-table";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { getServerLocale } from "@/lib/locale-server";
import { listAdminOrders } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).admin.ordersMeta,
  };
}

export default async function AdminOrdersPage() {
  const locale = await getServerLocale();
  const admin = getDictionary(locale).admin;
  const access = await requireAdminPermission(adminPermissions.ordersRead).catch(() => null);

  if (!access) {
    return <AdminLockedState message={admin.ordersLocked} />;
  }

  const orders = await listAdminOrders(access.supabase);

  return (
    <main className="min-h-screen bg-background py-12">
      <Container>
        <Kicker>{admin.kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {admin.ordersPageTitle}
        </Heading>
        <Text className="mt-4 max-w-3xl" tone="muted">
          {admin.ordersPageSubtitle}
        </Text>
        <div className="mt-8">
          <AdminOrdersTable orders={orders} />
        </div>
      </Container>
    </main>
  );
}
