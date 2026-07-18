import { advisorImages } from "@/lib/advisor-site";
import { config, formatXaf } from "@/lib/config";

/**
 * Single source of truth for the Maison Fondjo product catalog.
 *
 * The Shop listing (`/shop`) renders from this array, so adding a future
 * product is a data-only change: append an entry here (and create its
 * dedicated page). Today the house sells one product — Sève Racine.
 */
export type CatalogProductStatus = "available" | "coming-soon";

export type CatalogProduct = {
  readonly slug: string;
  /** Dedicated product page route. */
  readonly href: string;
  readonly name: { readonly en: string; readonly fr: string };
  readonly tagline: { readonly en: string; readonly fr: string };
  /** Preformatted price (e.g. "15 000 XAF"). Empty for coming-soon items. */
  readonly priceXaf: string;
  readonly image: string;
  readonly imageAlt: { readonly en: string; readonly fr: string };
  readonly status: CatalogProductStatus;
};

export const catalogProducts: readonly CatalogProduct[] = [
  {
    slug: "seve-racine",
    href: "/seve-racine",
    name: { en: "Sève Racine", fr: "Sève Racine" },
    tagline: {
      en: "Botanical hair ritual oil for the scalp and lengths.",
      fr: "Huile rituel capillaire botanique pour le cuir chevelu et les longueurs.",
    },
    priceXaf: formatXaf(config.pricing.seveRacine),
    image: advisorImages.product,
    imageAlt: {
      en: "Sève Racine bottle in a reflective black studio",
      fr: "Flacon Sève Racine en studio noir réfléchissant",
    },
    status: "available",
  },
];
