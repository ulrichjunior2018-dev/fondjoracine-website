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
  const title = t(content.seo.title, "en");
  const description = t(content.seo.description, "en");

  return {
    title: { absolute: title },
    description,
    ...(isProduction
      ? {
          alternates: {
            canonical: siteConfig.url,
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
        alt: t(image.alt, "en"),
        height: image.height,
        src: image.src,
        width: image.width,
      },
      locale: "en_US",
      title,
      url: siteConfig.url,
    }),
  };
}

export default async function HomePage() {
  const content = await getElixirContent();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: t(item.question, "en"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(item.answer, "en"),
      },
    })),
  };

  return (
    <>
      <JsonLd data={buildBrandWebSiteJsonLd("en")} id="home-website-jsonld" />
      <JsonLd data={buildLocalBusinessJsonLd("en")} id="home-local-business-jsonld" />
      <JsonLd
        data={buildCatalogItemListJsonLd({ locale: "en", path: "/", includeComingSoon: false })}
        id="home-catalog-itemlist-jsonld"
      />
      <JsonLd data={faqJsonLd} id="home-faq-jsonld" />
      <PremiumStorefrontPage content={content} locale="en" />
    </>
  );
}
