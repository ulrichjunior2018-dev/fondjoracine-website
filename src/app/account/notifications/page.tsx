import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { NotificationPreferencesForm } from "@/features/account/components/notification-preferences-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getNotificationPreferences,
  getOrCreateCustomerAccount,
} from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.notifications.metaTitle };
}

export default async function AccountNotificationsPage() {
  const locale = await getServerLocale();
  const n = getDictionary(locale).account.notifications;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const preferences = await getNotificationPreferences(supabase, account.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {n.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {n.subtitle}
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
