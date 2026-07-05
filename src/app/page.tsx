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
    title: t(content.seo.title, "fr"),
    description: t(content.seo.description, "fr"),
    ...(isProduction
      ? {
          alternates: {
            canonical: siteConfig.url,
            languages: {
              fr: siteConfig.url,
            },
          },
        }
      : {}),
    openGraph: {
      title: t(content.seo.title, "fr"),
      description: t(content.seo.description, "fr"),
      locale: "fr_FR",
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
    description: t(content.seo.description, "fr"),
    image: content.images.map((image) => image.src),
    name: t(content.title, "fr"),
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
        name: t(content.product.name, "fr"),
      },
    },
  };
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
      <PremiumStorefrontPage content={content} locale="fr" />
    </>
  );
}
