import { advisorImages } from "@/lib/advisor-site";
import { config, formatXaf } from "@/lib/config";
import { siteImages } from "@/lib/site-images";

/**
 * Single source of truth for the Maison Fondjo product catalog.
 *
 * `/shop` and `/products/[slug]` render from this array. To add a product:
 * 1. Append an entry (status: "available" or "coming-soon").
 * 2. Prefer `href: "/products/<slug>"` so the shared product template picks it up.
 * 3. Put images under `public/images/` (or reuse an existing asset).
 * 4. When ready to sell online, set `status: "available"` and optionally `orderHref`.
 *
 * Multi-SKU cart is scaffolded in `cart-service` / DB. wire when checkout outgrows one SKU.
 */
export type CatalogProductStatus = "available" | "coming-soon";

export type CatalogLocalized = {
  readonly en: string;
  readonly fr: string;
};

export type CatalogProduct = {
  readonly slug: string;
  /** Product detail route. use `/products/<slug>`. */
  readonly href: string;
  readonly name: CatalogLocalized;
  readonly tagline: CatalogLocalized;
  /** Short eyebrow above the product title on the detail page. */
  readonly eyebrow: CatalogLocalized;
  /** Longer product intro on the detail page. */
  readonly intro: CatalogLocalized;
  /** SEO / meta description. */
  readonly description: CatalogLocalized;
  /** Preformatted price (e.g. "15 000 F"). Empty for coming-soon items. */
  readonly priceXaf: string;
  readonly image: string;
  readonly imageAlt: CatalogLocalized;
  readonly status: CatalogProductStatus;
  /** Checkout / order path when the product can be purchased online. */
  readonly orderHref?: string;
};

export const catalogProducts: readonly CatalogProduct[] = [
  {
    slug: "seve-racine",
    href: "/products/seve-racine",
    name: { en: "Sève Racine", fr: "Sève Racine" },
    tagline: {
      en: "Botanical hair ritual oil for the scalp and lengths.",
      fr: "Huile rituel capillaire botanique pour le cuir chevelu et les longueurs.",
    },
    eyebrow: {
      en: "Botanical hair oil, 100 ml",
      fr: "Huile capillaire botanique, 100 ml",
    },
    intro: {
      en: "One bottle, one box, one simple recommendation: place the oil where the fibre and scalp actually need it.",
      fr: "Un flacon, un coffret, une recommandation simple : placer l'huile là où la fibre et le cuir chevelu en ont réellement besoin.",
    },
    description: {
      en: "Sève Racine by Maison Fondjo: botanical hair oil, 100 ml.",
      fr: "Sève Racine par Maison Fondjo : huile capillaire botanique, 100 ml.",
    },
    priceXaf: formatXaf(config.pricing.seveRacine),
    image: advisorImages.product,
    imageAlt: {
      en: "Sève Racine bottle in a reflective black studio",
      fr: "Flacon Sève Racine en studio noir réfléchissant",
    },
    status: "available",
    orderHref: "/checkout",
  },
  {
    slug: "elixir-nuit",
    href: "/products/elixir-nuit",
    name: { en: "Élixir Nuit", fr: "Élixir Nuit" },
    tagline: {
      en: "Night scalp serum, launching with the next Maison Fondjo drop.",
      fr: "Sérum de nuit pour le cuir chevelu, prochain lancement Maison Fondjo.",
    },
    eyebrow: {
      en: "Coming soon",
      fr: "Bientôt",
    },
    intro: {
      en: "A night ritual for the scalp is in development. Join the newsletter to hear when it launches.",
      fr: "Un rituel de nuit pour le cuir chevelu est en préparation. Rejoignez la newsletter pour être prévenu du lancement.",
    },
    description: {
      en: "Élixir Nuit by Maison Fondjo, night scalp serum, coming soon.",
      fr: "Élixir Nuit par Maison Fondjo, sérum de nuit pour le cuir chevelu, bientôt.",
    },
    priceXaf: "",
    image: siteImages.productMacro,
    imageAlt: {
      en: "Maison Fondjo night elixir preview",
      fr: "Aperçu Élixir Nuit Maison Fondjo",
    },
    status: "coming-soon",
  },
];

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}

export function listAvailableCatalogProducts(): CatalogProduct[] {
  return catalogProducts.filter((product) => product.status === "available");
}

export function listComingSoonCatalogProducts(): CatalogProduct[] {
  return catalogProducts.filter((product) => product.status === "coming-soon");
}

/** Stable product detail paths for sitemap / static params. */
export function listCatalogProductSlugs(): string[] {
  return catalogProducts.map((product) => product.slug);
}
