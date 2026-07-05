import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { env } from "@/config/env";
import { publicCopy } from "@/content/copy";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { buildWaLink } from "@/lib/config";

export const metadata: Metadata = {
  title: publicCopy.metadata.contact.title,
  description: publicCopy.metadata.contact.description,
  openGraph: {
    description: publicCopy.metadata.contact.description,
    locale: "fr_FR",
    title: publicCopy.metadata.contact.title,
  },
};

export default async function ContactPage() {
  const content = await getElixirContent();
  const email = env.ADMIN_EMAIL || "hello@fondjoracine.com";
  const whatsappUrl = buildWaLink("consultation");

  return (
    <main className="min-h-screen bg-background py-16">
      <Container>
        <Kicker>Contact</Kicker>
        <Heading as="h1" className="mt-3 max-w-4xl" level="h2">
          Conseil produit, livraison au Cameroun, presse et sécurité.
        </Heading>
        <Text className="mt-5 max-w-3xl" tone="muted">
          Maison Fondjo travaille depuis Buea. WhatsApp reste le chemin le plus direct pour
          confirmer une zone de livraison, poser une question sur Sève Racine ou demander un suivi
          après diagnostic.
        </Text>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              external: true,
              href: whatsappUrl,
              icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
              label: "WhatsApp",
              text: content.whatsapp.phone,
              title: "Livraison et conseil produit",
            },
            {
              external: false,
              href: `mailto:${email}`,
              icon: <Mail className="h-5 w-5" aria-hidden="true" />,
              label: "Email",
              text: email,
              title: "Presse et administration",
            },
            {
              external: false,
              href: "/policies/terms",
              icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              label: "Sécurité",
              text: "Usage externe. Test cutané recommandé.",
              title: "Questions sécurité produit",
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
