import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Shipping Policy | FONDJO RACINE",
  description: "Shipping information for FONDJO RACINE SÈVE.",
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
          National delivery is available across Cameroon. Customers should provide accurate city,
          address, and phone details so the team can coordinate dispatch and delivery support.
        </Text>
        <Text className="mt-5" tone="muted">
          International shipping is available for diaspora customers and global buyers. Shipping
          fees, timelines, and courier options may vary by city and destination.
        </Text>
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
