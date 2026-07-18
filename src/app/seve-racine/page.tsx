import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SeveRacineRouteSection } from "@/components/AdvisorRouteSections";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, copy } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: "Sève Racine",
    description: copy.seveRacine.description,
    locale,
    path: "/seve-racine",
  });
}

export default function SeveRacinePage() {
  return (
    <AdvisorShell>
      <SeveRacineRouteSection />
    </AdvisorShell>
  );
}
