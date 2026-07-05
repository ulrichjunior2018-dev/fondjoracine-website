import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: copy.en.diagnostic.title,
  description: copy.en.diagnostic.description,
};

export default function DiagnosticPage() {
  return (
    <AdvisorShell>
      <DiagnosticQuiz />
    </AdvisorShell>
  );
}
