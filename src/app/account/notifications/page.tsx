import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { NotificationPreferencesForm } from "@/features/account/components/notification-preferences-form";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getNotificationPreferences,
  getOrCreateCustomerAccount,
} from "@/services/customer/customer-service";

export const metadata: Metadata = { title: "Notifications" };

export default async function AccountNotificationsPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const preferences = await getNotificationPreferences(supabase, account.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          Notifications
        </Heading>
        <Text className="mt-2" tone="muted">
          Choose what Maison Fondjo can send you.
        </Text>
      </div>

      <Card>
        <CardContent>
          <NotificationPreferencesForm initialPreferences={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
