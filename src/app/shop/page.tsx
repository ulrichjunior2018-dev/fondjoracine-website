import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { ShopRouteSection } from "@/components/ShopRouteSection";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, copy } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: copy.home.shop.metaTitle,
    description: copy.home.shop.metaDescription,
    locale,
    path: "/shop",
  });
}

/**
 * Catalog from `src/content/products.ts` — one viewport: intro + available products + soon.
 */
export default function ShopPage() {
  return (
    <AdvisorShell>
      <ShopRouteSection />
    </AdvisorShell>
  );
}
