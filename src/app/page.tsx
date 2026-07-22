import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { PremiumStorefrontPage } from "@/features/elixir/components/premium-storefront-page";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { config } from "@/lib/config";
import { buildShareMetadata } from "@/lib/seo/share-metadata";

const isProduction = config.env === "production";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getElixirContent();
  const image = getPrimaryElixirImage(content);
  const title = t(content.seo.title, "en");
  const description = t(content.seo.description, "en");

  return {
    title,
    description,
    ...(isProduction
      ? {
          alternates: {
            canonical: siteConfig.url,
            languages: {
              en: siteConfig.url,
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
  const xafPrice = Number.parseInt(content.product.priceXaf.replace(/[^\d]/g, ""), 10);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: {
      "@type": "Brand",
      name: content.brand,
    },
    description: t(content.seo.description, "en"),
    image: content.images.map((image) => image.src),
    name: t(content.title, "en"),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: Number.isFinite(xafPrice) ? String(xafPrice) : String(config.pricing.seveRacine),
      priceCurrency: "XAF",
      url: siteConfig.url,
    },
  };
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Maison Fondjo",
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buea",
      addressCountry: "CM",
    },
    areaServed: ["Cameroon"],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: t(content.product.name, "en"),
      },
    },
  };
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
      <JsonLd data={productJsonLd} id="home-product-jsonld" />
      <JsonLd data={localBusinessJsonLd} id="home-local-business-jsonld" />
      <JsonLd data={faqJsonLd} id="home-faq-jsonld" />
      <PremiumStorefrontPage content={content} locale="en" />
    </>
  );
}
