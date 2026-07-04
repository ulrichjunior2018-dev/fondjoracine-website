import type { Metadata } from "next";
import Image from "next/image";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorImages, advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { getElixirContent } from "@/features/elixir/lib/cms";

export const metadata: Metadata = {
  title: "Sève Racine | FONDJO RACINE",
  description: "Découvrez le coffret Sève Racine, huile rituelle numérotée de FONDJO RACINE.",
};

export default async function SeveRacinePage() {
  const content = await getElixirContent();
  const whatsappUrl = buildWhatsAppUrl(
    content.whatsapp.phone,
    `Bonjour FONDJO RACINE, je souhaite commander Sève Racine (${advisorPricing.productXaf}) et recevoir les informations de livraison.`,
  );

  return (
    <AdvisorShell>
      <section className="grid min-h-[calc(100svh-5rem)] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="mx-auto w-full max-w-xl lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden border border-[#d6b75b]/16 bg-black">
            <Image
              alt="Sève Racine bottle in reflective black studio light"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              src={advisorImages.product}
            />
          </div>
        </div>
        <div className="mx-auto max-w-2xl lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
            Coffret numéroté
          </p>
          <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
            Sève Racine, préparée pour le rituel.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#f6f0e4]/68">
            Un flacon, un coffret, une recommandation simple : placer l&apos;huile là où la fibre et
            le cuir chevelu en ont réellement besoin.
          </p>
          <p className="mt-7 font-mono text-2xl text-[#d6b75b]">{advisorPricing.productXaf}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Chauffer quelques gouttes", "Masser la racine", "Finir longueurs ou barbe"].map(
              (step, index) => (
                <div className="border border-[#d6b75b]/14 bg-white/[0.025] p-4" key={step}>
                  <p className="font-mono text-xs text-[#d6b75b]">0{index + 1}</p>
                  <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/68">{step}</p>
                </div>
              ),
            )}
          </div>
          <a
            className="mt-9 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Commander sur WhatsApp
          </a>
        </div>
      </section>
    </AdvisorShell>
  );
}
