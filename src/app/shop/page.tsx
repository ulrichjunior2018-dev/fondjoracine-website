import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SeveRacineRouteSection } from "@/components/AdvisorRouteSections";
import { ShopComingSoonTeaser } from "@/components/ShopComingSoonTeaser";
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
 * Shop lands on the product page first. One order CTA opens WhatsApp from there.
 * The coming-soon teaser below keeps the collection visible while new SKUs ship.
 */
export default function ShopPage() {
  return (
    <AdvisorShell>
      <SeveRacineRouteSection />
      <ShopComingSoonTeaser />
    </AdvisorShell>
  );
}
