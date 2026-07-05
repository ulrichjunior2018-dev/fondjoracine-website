import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { publicCopy } from "@/content/copy";

export const metadata: Metadata = {
  title: publicCopy.metadata.privacy.title,
  description: publicCopy.metadata.privacy.description,
  openGraph: {
    description: publicCopy.metadata.privacy.description,
    locale: "fr_FR",
    title: publicCopy.metadata.privacy.title,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>{publicCopy.policies.kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {publicCopy.policies.privacy.title}
        </Heading>
        {publicCopy.policies.privacy.body.map((paragraph) => (
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
