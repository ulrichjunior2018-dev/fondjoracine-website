import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { publicCopy } from "@/content/copy";

export const metadata: Metadata = {
  title: publicCopy.metadata.terms.title,
  description: publicCopy.metadata.terms.description,
  openGraph: {
    description: publicCopy.metadata.terms.description,
    locale: "fr_FR",
    title: publicCopy.metadata.terms.title,
  },
};

export default function TermsPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>{publicCopy.policies.kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {publicCopy.policies.terms.title}
        </Heading>
        {publicCopy.policies.terms.body.map((paragraph) => (
          <Text className="mt-5" key={paragraph} tone="muted">
            {paragraph}
          </Text>
        ))}
        <Link className="mt-8 inline-flex text-sm font-semibold text-accent" href="/">
          {publicCopy.policies.backHome}
        </Link>
      </Container>
    </main>
  );
}
