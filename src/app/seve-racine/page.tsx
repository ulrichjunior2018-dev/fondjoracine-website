import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SeveRacineRouteSection } from "@/components/AdvisorRouteSections";
import { advisorCopy } from "@/content/advisor-copy";

export const metadata: Metadata = {
  title: "Sève Racine | Maison Fondjo",
  description: advisorCopy.seveRacine.description,
};

export default function SeveRacinePage() {
  return (
    <AdvisorShell>
      <SeveRacineRouteSection />
    </AdvisorShell>
  );
}
