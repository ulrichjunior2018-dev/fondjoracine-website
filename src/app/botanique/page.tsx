import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { BotaniqueRouteSection } from "@/components/AdvisorRouteSections";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Botanicals",
  description: copy.en.botanique.description,
  path: "/botanique",
});

export default function BotaniquePage() {
  return (
    <AdvisorShell>
      <BotaniqueRouteSection />
    </AdvisorShell>
  );
}
