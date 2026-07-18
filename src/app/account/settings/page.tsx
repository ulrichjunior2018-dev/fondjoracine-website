import type { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons/icons";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { listConfiguredIdentityProviders } from "@/lib/identity/registry";
import { getServerLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.settings.metaTitle };
}

export default async function AccountSettingsPage() {
  const locale = await getServerLocale();
  const s = getDictionary(locale).account.settings;
  const nav = getDictionary(locale).account.nav;
  const methodCount = listConfiguredIdentityProviders().length;
  const methodSummary =
    methodCount === 1 ? s.methodsOne : s.methodsMany.replace("{count}", String(methodCount));

  const settingsLinks = [
    {
      description: s.profileDesc,
      href: "/account/profile" as const,
      icon: "user" as const,
      title: nav.myProfile,
    },
    {
      description: s.securityDesc.replace("{methods}", methodSummary),
      href: "/account/security" as const,
      icon: "lock" as const,
      title: nav.security,
    },
    {
      description: s.notificationsDesc,
      href: "/account/notifications" as const,
      icon: "bell" as const,
      title: nav.notifications,
    },
    {
      description: s.addressesDesc,
      href: "/account/addresses" as const,
      icon: "mapPin" as const,
      title: nav.addresses,
    },
  ];

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

      <div className="grid gap-3">
        {settingsLinks.map((item) => {
          const Icon = Icons[item.icon];

          return (
            <Link
              className="flex min-h-16 items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent-muted"
              href={item.href}
              key={item.href}
            >
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-accent-muted text-accent">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-foreground">{item.title}</span>
                <span className="mt-0.5 block text-sm text-foreground/68">{item.description}</span>
              </span>
              <Icons.chevronRight
                aria-hidden="true"
                className="mt-2 h-4 w-4 shrink-0 text-foreground/40"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
