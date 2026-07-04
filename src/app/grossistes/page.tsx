import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { getElixirContent } from "@/features/elixir/lib/cms";

export const metadata: Metadata = {
  title: "Grossistes | FONDJO RACINE",
  description:
    "Conditions grossistes FONDJO RACINE : MOQ 20, tarif professionnel et contact WhatsApp.",
};

export default async function GrossistesPage() {
  const content = await getElixirContent();
  const whatsappUrl = buildWhatsAppUrl(
    content.whatsapp.phone,
    `Bonjour FONDJO RACINE, je souhaite recevoir les conditions grossistes: ${advisorPricing.wholesaleMoq}, ${advisorPricing.wholesaleUnitXaf} par unite.`,
  );

  return (
    <AdvisorShell>
      <section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-4xl content-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
          Accès professionnel
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
          Grossistes & revendeurs.
        </h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
            <p className="font-mono text-2xl text-[#d6b75b]">{advisorPricing.wholesaleMoq}</p>
            <p className="mt-3 text-sm text-[#f6f0e4]/62">Commande minimum</p>
          </div>
          <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
            <p className="font-mono text-2xl text-[#d6b75b]">{advisorPricing.wholesaleUnitXaf}</p>
            <p className="mt-3 text-sm text-[#f6f0e4]/62">Prix unitaire professionnel</p>
          </div>
          <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
            <p className="font-mono text-2xl text-[#d6b75b]">WhatsApp</p>
            <p className="mt-3 text-sm text-[#f6f0e4]/62">Validation directe</p>
          </div>
        </div>
        <a
          className="mt-10 inline-flex min-h-13 w-fit items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
          href={whatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          Contacter sur WhatsApp
        </a>
      </section>
    </AdvisorShell>
  );
}
