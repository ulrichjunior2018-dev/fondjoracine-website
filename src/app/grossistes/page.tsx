import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { GrossistesRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Wholesale",
  description: copy.en.grossistes.description,
  path: "/grossistes",
});

export default function GrossistesPage() {
  return (
    <AdvisorShell>
      <GrossistesRouteSection />
    </AdvisorShell>
  );
}
