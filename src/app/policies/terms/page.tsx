import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.terms);
}

export default async function TermsPage() {
  const { publicCopy } = await resolvePublicCopy();

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
