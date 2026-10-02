import type { Metadata, Route } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { env } from "@/config/env";
import { buildWaLink } from "@/lib/config";
import { getServerLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.support.metaTitle };
}

export default async function AccountSupportPage() {
  const locale = await getServerLocale();
  const s = getDictionary(locale).account.support;
  const whatsappUrl = buildWaLink("support", undefined, locale.startsWith("fr") ? "fr" : "en");
  const careEmail = env.RESEND_FROM_EMAIL || env.ADMIN_EMAIL || "care@maisonfondjo.com";

  const cards = [
    {
      body: s.whatsappBody,
      cta: s.whatsappCta,
      href: whatsappUrl,
      icon: "lifeBuoy" as const,
      title: s.whatsapp,
      external: true,
    },
    {
      body: s.emailBody,
      cta: s.emailCta,
      href: `mailto:${careEmail}`,
      icon: "mail" as const,
      title: s.email,
      external: true,
    },
    {
      body: s.faqsBody,
      cta: s.faqsCta,
      href: "/learn" as Route,
      icon: "clipboardList" as const,
      title: s.faqs,
      external: false,
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

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/55">
          {s.contactTitle}
        </h2>
        <div className="mt-3 grid gap-3">
          {cards.map((card) => {
            const Icon = Icons[card.icon];
            const className =
              "flex min-h-16 items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent-muted";
            const content = (
              <>
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-accent-muted text-accent">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-foreground/68">{card.body}</span>
                  <span className="mt-2 block text-sm font-semibold text-accent">{card.cta} →</span>
                </span>
              </>
            );

            return card.external ? (
              <a
                className={className}
                href={card.href}
                key={card.title}
                rel="noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <Link className={className} href={card.href as Route} key={card.title}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{s.ordersHint}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link className="text-sm font-semibold text-accent" href="/account/orders">
            {s.ordersCta} →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
