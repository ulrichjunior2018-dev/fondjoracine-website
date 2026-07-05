import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SurMesureRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Sur-mesure | Maison Fondjo",
  description: copy.en.surMesure.description,
};

export default function SurMesurePage() {
  return (
    <AdvisorShell>
      <SurMesureRouteSection />
    </AdvisorShell>
  );
}
