import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SurMesureRouteSection } from "@/components/AdvisorRouteSections";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, copy } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: locale === "fr" ? "Sur-mesure" : "Bespoke care",
    description: copy.surMesure.description,
    locale,
    path: "/sur-mesure",
  });
}

export default function SurMesurePage() {
  return (
    <AdvisorShell>
      <SurMesureRouteSection />
    </AdvisorShell>
  );
}
