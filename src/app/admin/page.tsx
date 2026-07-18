import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { AdminLockedState } from "@/features/admin/components/admin-locked-state";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdminPermission } from "@/lib/auth/rbac";
import { adminPermissions } from "@/lib/database/schema";
import { getServerLocale } from "@/lib/locale-server";
import { getAdminDashboardData } from "@/services/commerce/admin-dashboard-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).admin.metaTitle,
  };
}

export default async function AdminPage() {
  const locale = await getServerLocale();
  const admin = getDictionary(locale).admin;
  const access = await requireAdminPermission(adminPermissions.analyticsRead).catch(() => null);

  if (!access) {
    return <AdminLockedState />;
  }

  const dashboard = await getAdminDashboardData(access.supabase);

  return (
    <main className="min-h-screen bg-background py-10">
      <Container>
        <Kicker>{admin.kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {admin.title}
        </Heading>
        <Text className="mt-4 max-w-3xl" tone="muted">
          {admin.subtitle}
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
