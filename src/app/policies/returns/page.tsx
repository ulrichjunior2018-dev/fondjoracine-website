import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | FONDJO RACINE",
  description: "Return and exchange terms for FONDJO RACINE SÈVE orders.",
};

export default function ReturnsPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>Policy</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Return & Exchange Policy
        </Heading>
        <Text className="mt-5" tone="muted">
          Because SÈVE is a personal-care product, opened bottles cannot be returned for hygiene
          reasons. If your order arrives damaged, incorrect, or incomplete, contact us within 48
          hours with your order number and clear photos so the team can review an exchange or
          refund.
        </Text>
        <Text className="mt-5" tone="muted">
          Cancellation requests are reviewed case by case before packing or dispatch. After an order
          is dispatched, delivery and hygiene conditions may limit cancellation options.
        </Text>
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
