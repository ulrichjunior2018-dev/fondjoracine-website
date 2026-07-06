import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SeveRacineRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Sève Racine",
  description: copy.en.seveRacine.description,
  path: "/seve-racine",
});

export default function SeveRacinePage() {
  return (
    <AdvisorShell>
      <SeveRacineRouteSection />
    </AdvisorShell>
  );
}
