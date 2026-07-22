import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.faq);
}

export default async function FaqPage() {
  const { publicCopy } = await resolvePublicCopy();
  const faq = publicCopy.faqPage;

  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>{faq.kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {faq.title}
        </Heading>
        <Text className="mt-4 max-w-2xl" tone="muted">
          {faq.intro}
        </Text>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {faq.items.map((item) => (
            <details className="group py-5" key={item.question}>
              <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/68">{item.answer}</p>
            </details>
          ))}
        </div>

        <Link className="mt-10 inline-flex text-sm font-semibold text-accent" href="/">
          {publicCopy.policies.backHome}
        </Link>
      </Container>
    </main>
  );
}
