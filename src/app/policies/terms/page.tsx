import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Terms of Service | FONDJO RACINE",
  description: "Terms for using fondjoracine.com and preordering FONDJO RACINE SÈVE.",
};

export default function TermsPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>Policy</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          Terms of Service
        </Heading>
        <Text className="mt-5" tone="muted">
          By placing a preorder, you agree to provide accurate delivery and payment information.
          Batch #001 contains only 30 bottles. Preorder price is 8,500 XAF; the standard price after
          preorder is 9,500 XAF. Orders ship from July 6, 2026, subject to payment confirmation and
          delivery coordination.
        </Text>
        <Text className="mt-5" tone="muted">
          SÈVE is a cosmetic hair treatment oil for external use only. It does not diagnose, treat,
          cure, prevent disease, guarantee regrowth, or replace a dermatologist. Patch test before
          use, avoid contact with eyes, keep out of reach of children, and discontinue use if
          irritation occurs.
        </Text>
        <Text className="mt-5" tone="muted">
          We may refuse, cancel, or refund orders where payment cannot be verified, stock is
          unavailable, details appear fraudulent, or delivery cannot be completed.
        </Text>
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          Return home
        </Link>
      </Container>
    </main>
  );
}
