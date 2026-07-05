import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorCopy } from "@/content/advisor-copy";
import { buildWhatsAppUrl } from "@/lib/advisor-site";

export const metadata: Metadata = {
  title: "Sur-mesure | Maison Fondjo",
  description: advisorCopy.surMesure.description,
};

export default function SurMesurePage() {
  const whatsappUrl = buildWhatsAppUrl("consultation");

  return (
    <AdvisorShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
            {advisorCopy.surMesure.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
            {advisorCopy.surMesure.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f6f0e4]/68">
            {advisorCopy.surMesure.body}
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {advisorCopy.surMesure.steps.map(([number, title, text]) => (
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
            {advisorCopy.surMesure.cta}
          </a>
        </div>
      </section>
    </AdvisorShell>
  );
}
