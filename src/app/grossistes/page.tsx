import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { GrossistesRouteSection } from "@/components/AdvisorRouteSections";
import { advisorCopy } from "@/content/advisor-copy";

export const metadata: Metadata = {
  title: "Grossistes | Maison Fondjo",
  description: advisorCopy.grossistes.description,
};

export default function GrossistesPage() {
  return (
    <AdvisorShell>
      <GrossistesRouteSection />
    </AdvisorShell>
  );
}
