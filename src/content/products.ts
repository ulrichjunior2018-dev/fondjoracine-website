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
 * 5. Fill `seoTitle` + `description` for unique PDP metadata (EN/FR).
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
  /**
   * SEO title segment (no brand suffix — layout template adds "| Maison Fondjo").
   * Target one primary intent per product URL.
   */
  readonly seoTitle: CatalogLocalized;
  /** SEO / meta description (~140–160 chars). */
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
    seoTitle: {
      en: "Sève Racine Botanical Hair Oil",
      fr: "Huile capillaire botanique Sève Racine",
    },
    description: {
      en: "Sève Racine is Maison Fondjo's 100 ml botanical hair oil for scalp comfort and soft lengths. Pressed in Buea, Cameroon, with free delivery guidance nationwide.",
      fr: "Sève Racine est l'huile capillaire botanique 100 ml de Maison Fondjo pour le confort du cuir chevelu et des longueurs souples. Pressee a Buea, Cameroun.",
    },
    priceXaf: formatXaf(config.pricing.seveRacine),
    image: advisorImages.product,
    imageAlt: {
      en: "Maison Fondjo Sève Racine bottle on stone in natural light",
      fr: "Flacon Maison Fondjo Sève Racine sur pierre en lumière naturelle",
    },
    status: "available",
    orderHref: "/checkout",
  },
  {
    slug: "shampoo",
    href: "/products/shampoo",
    name: { en: "Shampoo", fr: "Shampoing" },
    tagline: {
      en: "A botanical cleanse for the scalp. Bottle reveal coming soon.",
      fr: "Un nettoyage botanique pour le cuir chevelu. Flacon bientôt dévoilé.",
    },
    eyebrow: {
      en: "Coming soon",
      fr: "Bientôt",
    },
    intro: {
      en: "The Maison Fondjo shampoo is in development. The name is here. The bottle will be revealed when the formula is ready.",
      fr: "Le shampoing Maison Fondjo est en préparation. Le nom est là. Le flacon sera dévoilé quand la formule sera prête.",
    },
    seoTitle: {
      en: "Botanical Hair Shampoo (Coming Soon)",
      fr: "Shampoing capillaire botanique (bientôt)",
    },
    description: {
      en: "Upcoming Maison Fondjo botanical shampoo for a clean scalp. Join the newsletter for the bottle reveal and Cameroon launch timing.",
      fr: "Prochain shampoing botanique Maison Fondjo pour un cuir chevelu propre. Inscrivez-vous pour le dévoilement du flacon et le lancement au Cameroun.",
    },
    priceXaf: "",
    image: siteImages.studioBottle,
    imageAlt: {
      en: "Maison Fondjo shampoo, coming soon",
      fr: "Shampoing Maison Fondjo, bientôt",
    },
    status: "coming-soon",
  },
  {
    slug: "conditioner",
    href: "/products/conditioner",
    name: { en: "Conditioner", fr: "Après-shampoing" },
    tagline: {
      en: "Softness and slip for the lengths. Bottle reveal coming soon.",
      fr: "Douceur et glisse pour les longueurs. Flacon bientôt dévoilé.",
    },
    eyebrow: {
      en: "Coming soon",
      fr: "Bientôt",
    },
    intro: {
      en: "The Maison Fondjo conditioner is in development. Stay curious. The bottle arrives with the finished formula.",
      fr: "L'après-shampoing Maison Fondjo est en préparation. Restez curieux. Le flacon arrivera avec la formule terminée.",
    },
    seoTitle: {
      en: "Botanical Hair Conditioner (Coming Soon)",
      fr: "Après-shampoing botanique (bientôt)",
    },
    description: {
      en: "Upcoming Maison Fondjo conditioner for soft, manageable lengths. Botanical line expanding — subscribe for the reveal.",
      fr: "Prochain après-shampoing Maison Fondjo pour des longueurs souples et faciles à coiffer. Abonnez-vous pour le dévoilement.",
    },
    priceXaf: "",
    image: siteImages.productOutdoorAlt,
    imageAlt: {
      en: "Maison Fondjo conditioner, coming soon",
      fr: "Après-shampoing Maison Fondjo, bientôt",
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
