import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { PremiumStorefrontPage } from "@/features/elixir/components/premium-storefront-page";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { config } from "@/lib/config";

const isProduction = config.env === "production";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getElixirContent();
  const image = getPrimaryElixirImage(content);

  return {
    title: t(content.seo.title, "en"),
    description: t(content.seo.description, "en"),
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
    openGraph: {
      title: t(content.seo.title, "en"),
      description: t(content.seo.description, "en"),
      locale: "en_US",
      url: siteConfig.url,
      images: [
        {
          alt: t(image.alt, "en"),
          height: image.height,
          url: image.src,
          width: image.width,
        },
      ],
    },
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
    areaServed: ["Cameroun", "Buea", "Douala", "Yaounde"],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PremiumStorefrontPage content={content} locale="en" />
    </>
  );
}
