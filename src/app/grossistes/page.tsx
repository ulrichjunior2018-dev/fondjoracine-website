import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { GrossistesRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Grossistes | Maison Fondjo",
  description: copy.en.grossistes.description,
};

export default function GrossistesPage() {
  return (
    <AdvisorShell>
      <GrossistesRouteSection />
    </AdvisorShell>
  );
}
