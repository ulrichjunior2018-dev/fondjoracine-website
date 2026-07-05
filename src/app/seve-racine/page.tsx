import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { SeveRacineRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Sève Racine | Maison Fondjo",
  description: copy.en.seveRacine.description,
};

export default function SeveRacinePage() {
  return (
    <AdvisorShell>
      <SeveRacineRouteSection />
    </AdvisorShell>
  );
}
