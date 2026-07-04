import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { getElixirContent } from "@/features/elixir/lib/cms";

export const metadata: Metadata = {
  title: "Sur-mesure | FONDJO RACINE",
  description:
    "Le plafond premium FONDJO RACINE : diagnostic, consultation privée et formule sur-mesure.",
};

export default async function SurMesurePage() {
  const content = await getElixirContent();
  const whatsappUrl = buildWhatsAppUrl(
    content.whatsapp.phone,
    `Bonjour FONDJO RACINE, je souhaite comprendre le parcours Sur-mesure (${advisorPricing.surMesureXaf}).`,
  );

  return (
    <AdvisorShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
            Le plafond premium
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
            Diagnostic. Consultation. Formule.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f6f0e4]/68">
            Le sur-mesure donne un cadre aux besoins qui demandent plus qu&apos;un flacon standard.
            Il rend Sève Racine accessible, et la formule privée exceptionnelle.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [
                "01",
                "Diagnostic",
                "Comprendre la texture, le rythme, le cuir chevelu et les limites.",
              ],
              [
                "02",
                "Consultation",
                `${advisorPricing.consultationCreditXaf}, créditée si la formule est préparée.`,
              ],
              ["03", "Formule", `Préparation sur-mesure à ${advisorPricing.surMesureXaf}.`],
            ].map(([number, title, text]) => (
              <article className="border border-[#d6b75b]/16 bg-white/[0.025] p-6" key={title}>
                <p className="font-mono text-xs text-[#d6b75b]">{number}</p>
                <h2 className="mt-8 font-serif text-3xl">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/66">{text}</p>
              </article>
            ))}
          </div>
          <a
            className="mt-10 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Demander une consultation
          </a>
        </div>
      </section>
    </AdvisorShell>
  );
}
