import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CreditCard, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorCopy } from "@/content/advisor-copy";
import { advisorImages, advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";

export const metadata: Metadata = {
  title: "Sève Racine | Maison Fondjo",
  description: advisorCopy.seveRacine.description,
};

export default function SeveRacinePage() {
  const whatsappUrl = buildWhatsAppUrl("order");

  return (
    <AdvisorShell>
      <section className="grid min-h-[calc(100svh-5rem)] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="mx-auto w-full max-w-xl lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden border border-[#d6b75b]/16 bg-black">
            <Image
              alt={advisorCopy.seveRacine.alt}
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
            {advisorCopy.seveRacine.batchLine}
          </p>
          <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
            {advisorCopy.seveRacine.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#f6f0e4]/68">{advisorCopy.seveRacine.intro}</p>
          <p className="mt-7 font-mono text-2xl text-[#d6b75b]">{advisorPricing.productXaf}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {advisorCopy.seveRacine.steps.map((step, index) => (
              <div className="border border-[#d6b75b]/14 bg-white/[0.025] p-4" key={step}>
                <p className="font-mono text-xs text-[#d6b75b]">0{index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/68">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {advisorCopy.seveRacine.shippingCards.map((item, index) => (
              <div className="border border-[#d6b75b]/14 bg-white/[0.025] p-4" key={item.label}>
                <div className="flex items-center gap-2 text-[#d6b75b]">
                  {index === 0 ? (
                    <Truck className="size-4" aria-hidden="true" />
                  ) : index === 1 ? (
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  ) : (
                    <PackageCheck className="size-4" aria-hidden="true" />
                  )}
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">{item.label}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/68">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {advisorCopy.seveRacine.payment.map((label, index) => (
              <div
                className="flex min-h-12 items-center gap-3 border border-[#d6b75b]/14 bg-[#d6b75b]/[0.055] px-4 text-sm font-semibold text-[#f6f0e4]"
                key={label}
              >
                <span className="text-[#d6b75b]">
                  {index === 0 ? (
                    <BadgeCheck className="size-4" aria-hidden="true" />
                  ) : (
                    <CreditCard className="size-4" aria-hidden="true" />
                  )}
                </span>
                {label}
              </div>
            ))}
          </div>
          <a
            className="mt-9 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            {advisorCopy.seveRacine.cta}
          </a>
        </div>
      </section>
    </AdvisorShell>
  );
}
