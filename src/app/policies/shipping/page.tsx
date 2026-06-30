import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Shipping Policy | FONDJO RACINE",
  description: "Shipping information for FONDJO RACINE SÈVE Batch #001.",
};

export default function ShippingPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>Policy</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Shipping Policy
        </Heading>
        <Text className="mt-5" tone="muted">
          Batch #001 ships from July 6, 2026. Cameroon deliveries are coordinated through WhatsApp
          after payment verification. Customers must provide accurate city, address, and phone
          details before dispatch.
        </Text>
        <Text className="mt-5" tone="muted">
          International payment and delivery support is Stripe-ready for future rollout. Shipping
          fees, timelines, and courier options may vary by city and destination.
        </Text>
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
