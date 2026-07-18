import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { buildAdvisorRouteMetadata } from "@/lib/seo/advisor-route-metadata";
import { resolveAdvisorCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, copy } = await resolveAdvisorCopy();
  return buildAdvisorRouteMetadata({
    title: locale === "fr" ? "Diagnostic cheveux" : "Hair diagnostic",
    description: copy.diagnostic.description,
    locale,
    path: "/diagnostic",
  });
}

export default function DiagnosticPage() {
  return (
    <AdvisorShell>
      <DiagnosticQuiz />
    </AdvisorShell>
  );
}
