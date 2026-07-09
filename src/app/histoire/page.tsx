import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { HistoireRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Story",
  description: copy.en.histoire.description,
  path: "/histoire",
});

export default function HistoirePage() {
  return (
    <AdvisorShell>
      <HistoireRouteSection />
    </AdvisorShell>
  );
}
