import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { advisorCopy } from "@/content/advisor-copy";

export const metadata: Metadata = {
  title: advisorCopy.diagnostic.title,
  description: advisorCopy.diagnostic.description,
};

export default function DiagnosticPage() {
  return (
    <AdvisorShell>
      <DiagnosticQuiz />
    </AdvisorShell>
  );
}
