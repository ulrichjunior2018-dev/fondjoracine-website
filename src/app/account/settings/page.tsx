import type { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons/icons";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = { title: "Settings" };

const settingsLinks = [
  {
    description: "Update your name, email, and phone number.",
    href: "/account/profile" as const,
    icon: "user" as const,
    title: "My Profile",
  },
  {
    description: "Password, connected accounts, and sign-out.",
    href: "/account/security" as const,
    icon: "lock" as const,
    title: "Security",
  },
  {
    description: "Choose what Maison Fondjo can send you.",
    href: "/account/notifications" as const,
    icon: "bell" as const,
    title: "Notifications",
  },
  {
    description: "Delivery and billing addresses.",
    href: "/account/addresses" as const,
    icon: "mapPin" as const,
    title: "Addresses",
  },
];

export default function AccountSettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          Settings
        </Heading>
        <Text className="mt-2" tone="muted">
          Manage your Maison Fondjo account preferences from one place.
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
