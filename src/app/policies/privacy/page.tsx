import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Privacy Policy | FONDJO RACINE",
  description:
    "How FONDJO RACINE collects and protects preorder, payment, consultation, and support information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>Policy</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Privacy Policy
        </Heading>
        <Text className="mt-5" tone="muted">
          FONDJO RACINE collects the information needed to process SÈVE preorders, verify manual
          Mobile Money payments, deliver orders, respond on WhatsApp, and improve the hair
          consultation experience. This may include name, phone, optional email, city, address,
          order details, payment reference, consultation answers, and support messages.
        </Text>
        <Text className="mt-5" tone="muted">
          Card payments, when enabled, are handled by Stripe. Manual MTN Mobile Money and Orange
          Money references are reviewed by the admin team before an order is confirmed. Consultation
          guidance is cosmetic only and is not medical advice.
        </Text>
        <Text className="mt-5" tone="muted">
          To request correction or deletion of your information, contact us through WhatsApp or the
          contact page. We keep business records only as long as needed for fulfilment, legal,
          security, and customer-support purposes.
        </Text>
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
