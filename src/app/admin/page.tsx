import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { AdminLockedState } from "@/features/admin/components/admin-locked-state";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { getAdminDashboardData } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Admin Dashboard | Maison Fondjo",
};

export default async function AdminPage() {
  const access = await requireAdminPermission(adminPermissions.analyticsRead).catch(() => null);

  if (!access) {
    return <AdminLockedState />;
  }

  const dashboard = await getAdminDashboardData(access.supabase);

  return (
    <main className="min-h-screen bg-background py-10">
      <Container>
        <Kicker>Admin</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Maison Fondjo command center
        </Heading>
        <Text className="mt-4 max-w-3xl" tone="muted">
          Edit the live storefront, manage orders and Mobile Money verification, approve proof,
          track stock, manage Inner Circle members, export customers, and monitor core metrics.
        </Text>
        <div className="mt-8">
          <AdminDashboard
            analytics={dashboard.analytics}
            consultations={dashboard.consultations}
            content={dashboard.content.content}
            innerCircle={dashboard.innerCircle}
            newsletter={dashboard.newsletter}
            orders={dashboard.orders}
          />
        </div>
      </Container>
    </main>
  );
}
