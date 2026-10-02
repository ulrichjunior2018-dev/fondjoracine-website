import type { CatalogProduct } from "@/content/products";
import { catalogProducts, listAvailableCatalogProducts } from "@/content/products";
import { siteConfig } from "@/config/site";
import { absoluteSiteUrl } from "@/lib/seo/absolute-url";
import type { Locale } from "@/content/copy";

function pickLocalized(locale: Locale, value: { en: string; fr: string }): string {
  return locale === "fr" ? value.fr : value.en;
}

function parseXafAmount(priceXaf: string): string | undefined {
  const amount = Number.parseInt(priceXaf.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(amount) ? String(amount) : undefined;
}

/** Product schema — Offer only when the SKU is live and priced. */
export function buildCatalogProductJsonLd(product: CatalogProduct, locale: Locale = "en") {
  const url = absoluteSiteUrl(product.href);
  const name = pickLocalized(locale, product.name);
  const description = pickLocalized(locale, product.description);
  const image = absoluteSiteUrl(product.image);
  const price = parseXafAmount(product.priceXaf);

  const base = {
    "@context": "https://schema.org",
    "@type": "Product" as const,
    name,
    description,
    image: [image],
    brand: {
      "@type": "Brand" as const,
      name: siteConfig.name,
    },
    url,
    sku: product.slug,
  };

  if (product.status !== "available" || !price) {
    return {
      ...base,
      // Pre-release: no InStock claim until shoppers can buy.
    };
  }

  return {
    ...base,
    offers: {
      "@type": "Offer" as const,
      url,
      priceCurrency: "XAF",
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization" as const,
        name: siteConfig.name,
      },
    },
  };
}

/** Catalog listing for `/shop` and brand home ItemList. */
export function buildCatalogItemListJsonLd(options?: {
  locale?: Locale;
  /** Prefer live SKUs on home; shop can list the full line. */
  includeComingSoon?: boolean;
  path?: string;
}) {
  const locale = options?.locale ?? "en";
  const path = options?.path ?? "/shop";
  const products = options?.includeComingSoon
    ? [...catalogProducts]
    : listAvailableCatalogProducts();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      locale === "fr"
        ? "Collection de soins capillaires Maison Fondjo"
        : "Maison Fondjo hair care collection",
    url: absoluteSiteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteSiteUrl(product.href),
      name: pickLocalized(locale, product.name),
      item: {
        "@type": "Product",
        name: pickLocalized(locale, product.name),
        url: absoluteSiteUrl(product.href),
        image: absoluteSiteUrl(product.image),
        brand: { "@type": "Brand", name: siteConfig.name },
        sku: product.slug,
      },
    })),
  };
}

export function buildBrandWebSiteJsonLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteSiteUrl(),
    description: siteConfig.description,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteSiteUrl(),
    },
  };
}

export function buildLocalBusinessJsonLd(locale: Locale = "en") {
  const available = listAvailableCatalogProducts();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: absoluteSiteUrl(),
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buea",
      addressCountry: "CM",
    },
    areaServed: locale === "fr" ? ["Cameroun"] : ["Cameroon"],
    makesOffer: available.map((product) => {
      const price = parseXafAmount(product.priceXaf);
      return {
        "@type": "Offer",
        url: absoluteSiteUrl(product.href),
        itemOffered: {
          "@type": "Product",
          name: pickLocalized(locale, product.name),
          url: absoluteSiteUrl(product.href),
        },
        ...(price
          ? {
              priceCurrency: "XAF",
              price,
            }
          : {}),
      };
    }),
  };
}
