import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { InternalExploreSection } from "@/components/internal-explore-section";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.faq);
}

export default async function FaqPage() {
  const { publicCopy, locale } = await resolvePublicCopy();
  const faq = publicCopy.faqPage;
  const shopLabel = locale === "fr" ? "Boutique" : "Shop";
  const shippingLabel = locale === "fr" ? "Livraison" : "Shipping";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-background py-16">
      <JsonLd data={faqJsonLd} id="faq-page-jsonld" />
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

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <Link className="text-accent" href="/">
            {publicCopy.policies.backHome}
          </Link>
          <Link className="text-accent" href={"/shop" as Route}>
            {shopLabel}
          </Link>
          <Link className="text-accent" href={"/products/seve-racine" as Route}>
            Sève Racine
          </Link>
          <Link className="text-accent" href={"/policies/shipping" as Route}>
            {shippingLabel}
          </Link>
        </div>
      </Container>
      <InternalExploreSection exclude="/faq" intent="support" tone="light" />
    </main>
  );
}
