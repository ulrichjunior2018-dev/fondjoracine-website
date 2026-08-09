import type { Locale } from "@/content/copy";
import { listAvailableCatalogProducts } from "@/content/products";

export type InternalLinkItem = {
  readonly href: string;
  readonly label: string;
  readonly description: string;
};

type Localized = { readonly en: string; readonly fr: string };

type LinkDef = {
  readonly href: string;
  readonly label: Localized;
  readonly description: Localized;
};

function pick(locale: Locale, value: Localized): string {
  return locale === "fr" ? value.fr : value.en;
}

/** Core marketing destinations used for SEO internal linking. */
const CORE_LINKS: readonly LinkDef[] = [
  {
    href: "/shop",
    label: { en: "Shop the collection", fr: "Voir la boutique" },
    description: {
      en: "Browse live botanical hair care and upcoming formulas.",
      fr: "Parcourir les soins botaniques disponibles et les formules à venir.",
    },
  },
  {
    href: "/products/seve-racine",
    label: { en: "Sève Racine hair oil", fr: "Huile Sève Racine" },
    description: {
      en: "Our flagship 100 ml botanical oil for scalp and lengths.",
      fr: "Notre huile botanique signature 100 ml pour le cuir chevelu et les longueurs.",
    },
  },
  {
    href: "/botanique",
    label: { en: "Botanical ingredients", fr: "Ingrédients botaniques" },
    description: {
      en: "Latin names, origin, and why each plant belongs in the blend.",
      fr: "Noms latins, origine et raison d'être de chaque plante dans le mélange.",
    },
  },
  {
    href: "/learn",
    label: { en: "Learn hair care", fr: "Comprendre les soins" },
    description: {
      en: "Rituals, formula, results, and the family behind Maison Fondjo.",
      fr: "Rituels, formule, résultats et la famille derrière Maison Fondjo.",
    },
  },
  {
    href: "/diagnostic",
    label: { en: "Hair diagnostic", fr: "Diagnostic capillaire" },
    description: {
      en: "Answer a few questions and get a clear next step.",
      fr: "Répondez à quelques questions pour une prochaine étape claire.",
    },
  },
  {
    href: "/histoire",
    label: { en: "Our story", fr: "Notre histoire" },
    description: {
      en: "Buea, Mount Cameroon, and the Maison Fondjo name.",
      fr: "Buea, le Mont Cameroun, et le nom Maison Fondjo.",
    },
  },
  {
    href: "/faq",
    label: { en: "FAQ", fr: "FAQ" },
    description: {
      en: "Delivery, payment, product safety, and how to order.",
      fr: "Livraison, paiement, sécurité produit et comment commander.",
    },
  },
  {
    href: "/policies/shipping",
    label: { en: "Shipping in Cameroon", fr: "Livraison au Cameroun" },
    description: {
      en: "How delivery works and what to expect after checkout.",
      fr: "Comment fonctionne la livraison et à quoi s'attendre après la commande.",
    },
  },
];

function toItems(locale: Locale, defs: readonly LinkDef[]): InternalLinkItem[] {
  return defs.map((def) => ({
    href: def.href,
    label: pick(locale, def.label),
    description: pick(locale, def.description),
  }));
}

function excludeCurrent(items: InternalLinkItem[], exclude?: string | readonly string[]) {
  if (!exclude) {
    return items;
  }
  const blocked = new Set(Array.isArray(exclude) ? exclude : [exclude]);
  return items.filter((item) => !blocked.has(item.href));
}

/** Links for shop, product, learn, botanique, histoire, diagnostic, FAQ, and home footers. */
export function getInternalExploreLinks(
  locale: Locale,
  options?: {
    /** Current path(s) to hide from the list. */
    exclude?: string | readonly string[];
    /** Prefer commerce + education mix (product/shop). */
    intent?: "commerce" | "education" | "story" | "support";
  },
): InternalLinkItem[] {
  const intent = options?.intent ?? "education";
  const availableProductLinks: InternalLinkItem[] = listAvailableCatalogProducts().map(
    (product) => ({
      href: product.href,
      label: locale === "fr" ? product.name.fr : product.name.en,
      description: locale === "fr" ? product.tagline.fr : product.tagline.en,
    }),
  );

  let ordered: LinkDef[] = [...CORE_LINKS];

  if (intent === "commerce") {
    ordered = [
      CORE_LINKS[0]!, // shop
      CORE_LINKS[1]!, // seve-racine
      CORE_LINKS[3]!, // learn
      CORE_LINKS[2]!, // botanique
      CORE_LINKS[4]!, // diagnostic
      CORE_LINKS[6]!, // faq
      CORE_LINKS[5]!, // histoire
    ];
  } else if (intent === "story") {
    ordered = [
      CORE_LINKS[5]!,
      CORE_LINKS[0]!,
      CORE_LINKS[1]!,
      CORE_LINKS[3]!,
      CORE_LINKS[2]!,
      CORE_LINKS[4]!,
    ];
  } else if (intent === "support") {
    ordered = [
      CORE_LINKS[6]!,
      CORE_LINKS[7]!,
      CORE_LINKS[0]!,
      CORE_LINKS[1]!,
      CORE_LINKS[4]!,
      CORE_LINKS[3]!,
    ];
  }

  const core = excludeCurrent(toItems(locale, ordered), options?.exclude);

  // On product pages: surface other live SKUs near the top of related links.
  if (intent === "commerce" && availableProductLinks.length > 0) {
    const products = excludeCurrent(availableProductLinks, options?.exclude);
    const seen = new Set(products.map((p) => p.href));
    return [...products, ...core.filter((item) => !seen.has(item.href))].slice(0, 6);
  }

  return core.slice(0, 6);
}

export function internalExploreCopy(locale: Locale) {
  return locale === "fr"
    ? {
        eyebrow: "Continuer",
        title: "Aller plus loin sur Maison Fondjo",
        intro: "Pages liées pour comprendre, choisir et commander en confiance.",
      }
    : {
        eyebrow: "Continue",
        title: "Explore more of Maison Fondjo",
        intro: "Related pages to understand, choose, and order with confidence.",
      };
}
