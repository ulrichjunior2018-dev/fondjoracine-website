import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { getElixirContent } from "@/features/elixir/lib/cms";

export const metadata: Metadata = {
  title: "Diagnostic cheveux | FONDJO RACINE",
  description:
    "Commencez par un diagnostic cheveux FONDJO RACINE avant de choisir Sève Racine ou une consultation privée.",
};

export default async function DiagnosticPage() {
  const content = await getElixirContent();

  return (
    <AdvisorShell>
      <DiagnosticQuiz whatsappPhone={content.whatsapp.phone} />
    </AdvisorShell>
  );
}
