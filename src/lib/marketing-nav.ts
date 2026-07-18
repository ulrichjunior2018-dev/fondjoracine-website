/** Shared marketing header nav helpers (homepage + AdvisorShell). */

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
