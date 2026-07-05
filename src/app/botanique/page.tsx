import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { BotaniqueRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Botanique | Maison Fondjo",
  description: copy.en.botanique.description,
};

export default function BotaniquePage() {
  return (
    <AdvisorShell>
      <BotaniqueRouteSection />
    </AdvisorShell>
  );
}
