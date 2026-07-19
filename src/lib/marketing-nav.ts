export type MarketingLocale = "en" | "fr";

/** Single source of truth for marketing header nav labels (EN + FR). */
const MARKETING_NAV_LABELS = {
  en: {
    home: "Home",
    diagnostic: "Diagnostic",
    botanicals: "Botanicals",
    learn: "Learn",
    shop: "Shop",
    bespoke: "Bespoke",
    story: "Story",
  },
  fr: {
    home: "Accueil",
    diagnostic: "Diagnostic",
    botanicals: "Botanique",
    learn: "Apprendre",
    shop: "Boutique",
    bespoke: "Sur-mesure",
    story: "Histoire",
  },
} as const;

export type MarketingNavEntry = readonly [string, string];

/** Full marketing nav tuples in display order (includes Shop — filter for desktop/mobile). */
export function buildMarketingNav(locale: MarketingLocale): readonly MarketingNavEntry[] {
  const labels = locale === "fr" ? MARKETING_NAV_LABELS.fr : MARKETING_NAV_LABELS.en;

  return [
    [labels.home, "/"],
    [labels.diagnostic, "/diagnostic"],
    [labels.botanicals, "/botanique"],
    [labels.learn, "/learn"],
    [labels.shop, "/shop"],
    [labels.bespoke, "/sur-mesure"],
    [labels.story, "/histoire"],
  ];
}

/** Gold header CTA — always "Shop" / "Boutique", never "Buy" / "Acheter". */
export function getMarketingShopLabel(locale: MarketingLocale): string {
  return locale === "fr" ? MARKETING_NAV_LABELS.fr.shop : MARKETING_NAV_LABELS.en.shop;
}

/** Shop lives only as the header CTA button — never as a text nav link. */
const SHOP_NAV_HREFS = new Set(["/shop", "/seve-racine"]);

/** Mobile under-header strip (Home included; Shop excluded — use the Shop button). */
export const MARKETING_MOBILE_NAV_HREFS = new Set([
  "/",
  "/botanique",
  "/learn",
  "/sur-mesure",
  "/histoire",
]);

export function isMarketingNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isShopNavHref(href: string) {
  return SHOP_NAV_HREFS.has(href);
}

/** Desktop center links: full marketing nav without Shop (Shop is the gold button). */
export function getMarketingDesktopNav(nav: ReadonlyArray<readonly [string, string]>) {
  return nav.filter(([, href]) => !isShopNavHref(href));
}

/** Mobile strip: Home + section links; Shop excluded. */
export function getMarketingMobileNav(nav: ReadonlyArray<readonly [string, string]>) {
  const seen = new Set<string>();

  return nav.filter(([, href]) => {
    if (isShopNavHref(href) || !MARKETING_MOBILE_NAV_HREFS.has(href)) {
      return false;
    }

    if (seen.has(href)) {
      return false;
    }

    seen.add(href);
    return true;
  });
}
