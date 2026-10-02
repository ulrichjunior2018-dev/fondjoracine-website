import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { NotificationPreferencesForm } from "@/features/account/components/notification-preferences-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getNotificationPreferences,
  getOrCreateCustomerAccount,
  listInboxNotifications,
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
  const [preferences, inbox] = await Promise.all([
    getNotificationPreferences(supabase, account.id),
    listInboxNotifications(supabase, account.profileId, 30),
  ]);

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
        <CardHeader>
          <CardTitle>{n.inboxTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {inbox.length === 0 ? (
            <p className="text-sm text-foreground/68">{n.emptyInbox}</p>
          ) : (
            <ul className="grid gap-3">
              {inbox.map((item) => (
                <li
                  className="rounded-md border border-border bg-surface-muted/40 px-4 py-3"
                  key={item.id}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.subject}</p>
                    {!item.readAt ? <Badge tone="accent">{n.unread}</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-foreground/68">{item.body}</p>
                  <p className="mt-2 text-xs text-foreground/50">
                    {new Date(item.createdAt).toLocaleString(locale === "fr" ? "fr-FR" : "en-US")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{n.preferencesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationPreferencesForm initialPreferences={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
