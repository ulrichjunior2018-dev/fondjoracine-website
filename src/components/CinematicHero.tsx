"use client";

import { ArrowRight, BadgeCheck, CreditCard, PenLine } from "lucide-react";
import Image from "next/image";

import { SceneGate } from "@/components/three/SceneGate";
import { useCopy } from "@/lib/i18n-context";
import { siteImages } from "@/lib/site-images";

type CinematicHeroProps = {
  consultationHref?: string;
  productHref?: string;
};

export function CinematicHero({
  consultationHref = "/diagnostic",
  productHref = "/seve-racine",
}: CinematicHeroProps) {
  const heroCopy = useCopy().home.hero;

  return (
    <>
      <section
        className="relative isolate h-[145svh] overflow-visible bg-[#0D0D0D] text-[#F7F4EB]"
        data-mobile-cta-section="hero"
        id="hero"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <Image
            alt={heroCopy.backgroundAlt}
            className="object-cover opacity-42"
            fill
            priority
            sizes="100vw"
            src={siteImages.heroOrigin}
          />
          <div className="absolute inset-0 z-10 bg-[#0D0D0D]/42" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_61%_52%,rgb(212_175_55/.18),transparent_28%),radial-gradient(circle_at_84%_38%,rgb(27_94_32/.3),transparent_36%),linear-gradient(102deg,#0D0D0D_0%,rgb(13_13_13/.92)_36%,rgb(27_94_32/.58)_68%,#0D0D0D_100%)]" />
          <SceneGate className="pointer-events-none absolute right-[-18vw] top-[13vh] z-[14] h-[58vh] w-[72vw] opacity-55 mix-blend-screen sm:right-[-8vw] sm:w-[56vw] md:right-[2vw] md:top-[16vh] md:h-[68vh] md:w-[42vw] md:opacity-70" />
          <div
            aria-hidden="true"
            className="absolute left-5 top-24 z-20 h-px w-28 bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] opacity-90 md:left-[7vw] md:top-28 md:w-48"
          />

          <div className="relative z-20 mx-auto grid min-h-svh w-full max-w-[1440px] items-center gap-6 px-5 pb-8 pt-[5.7rem] text-center md:grid-cols-[minmax(0,0.94fr)_minmax(18rem,0.72fr)_minmax(12rem,0.28fr)] md:gap-7 md:px-10 md:py-24 md:text-left xl:px-20">
            <div className="mx-auto max-w-[43rem] animate-[fondjoFadeUp_.8s_ease-out_both] md:mx-0">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
                {heroCopy.eyebrow}
              </p>
              <h1 className="mt-5 font-serif text-[clamp(2.72rem,11.4vw,5.1rem)] font-light leading-[0.92] tracking-normal text-[#F7F4EB] md:mt-6 md:text-[clamp(4rem,6.2vw,7rem)] md:leading-[0.91]">
                {heroCopy.titleFirst}
                <span className="block text-[#D4AF37]">{heroCopy.titleSecond}</span>
                <span className="block">{heroCopy.titleThird}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[40rem] text-[0.96rem] leading-7 text-[#F7F4EB]/78 md:mx-0 md:mt-6 md:text-lg md:leading-8">
                {heroCopy.story}
              </p>

              <div className="mt-6 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-10">
                <a
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-7 text-sm font-semibold text-[#0D0D0D] shadow-[0_22px_80px_rgb(212_175_55/.28)] transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  href={consultationHref}
                >
                  {heroCopy.primary}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#F7F4EB]/24 bg-[#0D0D0D]/32 px-7 text-sm font-semibold text-[#F7F4EB] backdrop-blur-md transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  href={productHref}
                >
                  {heroCopy.secondary}
                </a>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-[min(70vw,18.5rem)] animate-[fondjoFadeUp_1s_ease-out_.18s_both] md:mx-0 md:w-full md:max-w-[30rem]">
              <div className="absolute inset-[7%] rounded-[1.1rem] bg-[#D4AF37]/18 blur-3xl" />
              <div className="relative h-full overflow-hidden rounded-[0.85rem] border border-[#d6b75b]/38 bg-[#050403] shadow-[0_34px_90px_rgb(0_0_0/.58)]">
                <Image
                  alt={heroCopy.bottleAlt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 30rem, 70vw"
                  src={siteImages.studioBottle}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgb(5_4_3/.78)_100%)]" />
                <p className="absolute inset-x-5 bottom-5 border-t border-[#d6b75b]/24 pt-4 text-center text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#f6f0e4]/78">
                  Sève Racine · Maison Fondjo
                </p>
              </div>
            </div>

            <div aria-hidden="true" className="hidden md:block" />
          </div>
        </div>
      </section>

      <section
        aria-label={heroCopy.trustLabel}
        className="border-y border-[#D4AF37]/18 bg-[#0D0D0D] px-4 py-5 text-[#F7F4EB]"
      >
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
          {heroCopy.trustItems.map(([label, value], index) => {
            const Icon = index === 0 ? BadgeCheck : index === 1 ? PenLine : CreditCard;

            return (
              <div
                className="flex min-h-20 items-center gap-4 rounded-sm border border-[#d6b75b]/18 bg-[#f6f0e4]/[0.035] px-4"
                key={label}
              >
                <Icon className="size-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm text-[#F7F4EB]/74">{value}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
