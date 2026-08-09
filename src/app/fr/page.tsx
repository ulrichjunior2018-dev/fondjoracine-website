import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { PremiumStorefrontPage } from "@/features/elixir/components/premium-storefront-page";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { config } from "@/lib/config";
import {
  buildBrandWebSiteJsonLd,
  buildCatalogItemListJsonLd,
  buildLocalBusinessJsonLd,
} from "@/lib/seo/catalog-json-ld";
import { buildShareMetadata } from "@/lib/seo/share-metadata";

const isProduction = config.env === "production";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getElixirContent();
  const image = getPrimaryElixirImage(content);
  const title = t(content.seo.title, "fr");
  const description = t(content.seo.description, "fr");

  return {
    title: { absolute: title },
    description,
    ...(isProduction
      ? {
          alternates: {
            canonical: `${siteConfig.url}/fr`,
            languages: {
              en: siteConfig.url,
              fr: `${siteConfig.url}/fr`,
            },
          },
        }
      : {}),
    ...buildShareMetadata({
      description,
      image: {
        alt: t(image.alt, "fr"),
        height: image.height,
        src: image.src,
        width: image.width,
      },
      locale: "fr_FR",
      title,
      url: `${siteConfig.url}/fr`,
    }),
  };
}

export default async function FrenchHomePage() {
  const content = await getElixirContent();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: t(item.question, "fr"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(item.answer, "fr"),
      },
    })),
  };

  return (
    <>
      <JsonLd data={buildBrandWebSiteJsonLd("fr")} id="fr-home-website-jsonld" />
      <JsonLd data={buildLocalBusinessJsonLd("fr")} id="fr-home-local-business-jsonld" />
      <JsonLd
        data={buildCatalogItemListJsonLd({ locale: "fr", path: "/fr", includeComingSoon: false })}
        id="fr-home-catalog-itemlist-jsonld"
      />
      <JsonLd data={faqJsonLd} id="fr-home-faq-jsonld" />
      <PremiumStorefrontPage content={content} locale="fr" />
    </>
  );
}
