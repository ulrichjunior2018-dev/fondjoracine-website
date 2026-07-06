import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { copy } from "@/content/copy";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";

export const metadata: Metadata = buildAdvisorRouteMetadata({
  title: "Hair diagnostic",
  description: copy.en.diagnostic.description,
  path: "/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <AdvisorShell>
      <DiagnosticQuiz />
    </AdvisorShell>
  );
}
