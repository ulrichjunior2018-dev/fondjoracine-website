import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.settings.metaTitle };
}

/**
 * Settings = preferences for this account only.
 * Profile, orders, security, etc. stay in the main nav — not duplicated here.
 */
export default async function AccountSettingsPage() {
  const locale = await getServerLocale();
  const s = getDictionary(locale).account.settings;

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {s.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {s.subtitle}
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{s.languageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">{s.languageBody}</p>
          <p className="mt-2 text-xs text-foreground/55">{s.languageHint}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{s.marketingTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">{s.marketingBody}</p>
          <Link
            className="mt-3 inline-block text-sm font-semibold text-accent"
            href="/account/notifications"
          >
            {s.openNotifications}
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{s.themeTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">{s.themeBody}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{s.deleteAccountTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/68">{s.deleteAccountBody}</p>
          <Link
            className="mt-3 inline-block text-sm font-semibold text-accent"
            href="/account/support"
          >
            {s.deleteAccountCta}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
