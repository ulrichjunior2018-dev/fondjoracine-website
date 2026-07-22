import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { HistoireRouteSection } from "@/components/AdvisorRouteSections";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, copy } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: locale === "fr" ? "À propos" : "About Us",
    description: copy.histoire.description,
    locale,
    path: "/histoire",
  });
}

export default function HistoirePage() {
  return (
    <AdvisorShell>
      <HistoireRouteSection />
    </AdvisorShell>
  );
}
