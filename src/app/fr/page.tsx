import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
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
            canonical: `${siteConfig.url}/fr`,
            languages: {
              fr: `${siteConfig.url}/fr`,
            },
          },
        }
      : {}),
    openGraph: {
      title: t(content.seo.title, "fr"),
      description: t(content.seo.description, "fr"),
      locale: "fr_FR",
      url: `${siteConfig.url}/fr`,
      images: [
        {
          alt: t(image.alt, "fr"),
          height: image.height,
          url: image.src,
          width: image.width,
        },
      ],
    },
  };
}

export default async function FrenchHomePage() {
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
      url: `${siteConfig.url}/fr`,
    },
  };

  return (
    <>
      <JsonLd data={productJsonLd} id="fr-home-product-jsonld" />
      <PremiumStorefrontPage content={content} locale="fr" />
    </>
  );
}
