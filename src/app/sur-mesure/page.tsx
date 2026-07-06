import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SurMesureRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Bespoke care",
  description: copy.en.surMesure.description,
  path: "/sur-mesure",
});

export default function SurMesurePage() {
  return (
    <AdvisorShell>
      <SurMesureRouteSection />
    </AdvisorShell>
  );
}
