import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { env } from "@/config/env";
import { getElixirContent } from "@/features/elixir/lib/cms";

export const metadata: Metadata = {
  title: "Contact | FONDJO RACINE",
  description:
    "Contact FONDJO RACINE for SÈVE preorder support, payment verification, consultation follow-up, press, and product safety questions.",
};

export default async function ContactPage() {
  const content = await getElixirContent();
  const email = env.ADMIN_EMAIL || "hello@fondjoracine.com";
  const whatsappPhone = content.whatsapp.phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Hello FONDJO, I need help with SÈVE.",
  )}`;

  return (
    <main className="min-h-screen bg-background py-16">
      <Container>
        <Kicker>Contact</Kicker>
        <Heading as="h1" className="mt-3 max-w-4xl" level="h2">
          Payment verification, preorder support, press, and product safety.
        </Heading>
        <Text className="mt-5 max-w-3xl" tone="muted">
          FONDJO RACINE is founded and made in Buea, Cameroon. For Batch #001, WhatsApp is the
          fastest way to verify payment references, confirm delivery details, and request human
          follow-up after the hair consultation.
        </Text>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              href: whatsappUrl,
              icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />,
              label: "WhatsApp",
              text: content.whatsapp.phone,
              title: "Preorder and payment support",
            },
            {
              href: `mailto:${email}`,
              icon: <Mail className="h-5 w-5" aria-hidden="true" />,
              label: "Email",
              text: email,
              title: "Press and admin support",
            },
            {
              href: "/policies/terms",
              icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
              label: "Safety",
              text: "External use only. Patch test recommended.",
              title: "Product safety questions",
            },
          ].map((item) => (
            <a
              className="rounded-lg border border-border bg-surface p-6 shadow-soft transition-colors hover:border-accent/50"
              href={item.href}
              key={item.title}
              rel={item.href.startsWith("https://wa.me") ? "noreferrer" : undefined}
              target={item.href.startsWith("https://wa.me") ? "_blank" : undefined}
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
