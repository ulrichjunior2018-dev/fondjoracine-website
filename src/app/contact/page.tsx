import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { env } from "@/config/env";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { buildWaLink } from "@/lib/config";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.contact);
}

export default async function ContactPage() {
  const { publicCopy } = await resolvePublicCopy();
  const content = await getElixirContent();
  const email = env.ADMIN_EMAIL || "hello@maisonfondjo.com";
  const whatsappUrl = buildWaLink("consultation");

  return (
    <main className="min-h-screen bg-background py-16">
      <Container>
        <Kicker>{publicCopy.contactPage.kicker}</Kicker>
        <Heading as="h1" className="mt-3 max-w-4xl" level="h2">
          {publicCopy.contactPage.heading}
        </Heading>
        <Text className="mt-5 max-w-3xl" tone="muted">
          {publicCopy.contactPage.intro}
        </Text>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              external: true,
              href: whatsappUrl,
              icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
              label: publicCopy.contactPage.cards.whatsapp.label,
              text: content.whatsapp.phone,
              title: publicCopy.contactPage.cards.whatsapp.title,
            },
            {
              external: false,
              href: `mailto:${email}`,
              icon: <Mail className="h-5 w-5" aria-hidden="true" />,
              label: publicCopy.contactPage.cards.email.label,
              text: email,
              title: publicCopy.contactPage.cards.email.title,
            },
            {
              external: false,
              href: "/policies/terms",
              icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              label: publicCopy.contactPage.cards.safety.label,
              text: publicCopy.contactPage.cards.safety.text,
              title: publicCopy.contactPage.cards.safety.title,
            },
          ].map((item) => (
            <a
              className="rounded-lg border border-border bg-surface p-6 shadow-soft transition-colors hover:border-accent/50"
              href={item.href}
              key={item.title}
              rel={item.external ? "noreferrer" : undefined}
              target={item.external ? "_blank" : undefined}
            >
              <div className="text-accent">{item.icon}</div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {item.label}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/68">{item.text}</p>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}
