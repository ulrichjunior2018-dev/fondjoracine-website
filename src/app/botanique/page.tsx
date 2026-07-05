import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { BotaniqueRouteSection } from "@/components/AdvisorRouteSections";
import { advisorCopy } from "@/content/advisor-copy";

export const metadata: Metadata = {
  title: "Botanique | Maison Fondjo",
  description: advisorCopy.botanique.description,
};

export default function BotaniquePage() {
  return (
    <AdvisorShell>
      <BotaniqueRouteSection />
    </AdvisorShell>
  );
}
