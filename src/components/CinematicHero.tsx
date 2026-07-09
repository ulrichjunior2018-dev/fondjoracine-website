"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { SceneGate } from "@/components/three/SceneGate";
import { buildWaLink } from "@/lib/config";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { siteImages } from "@/lib/site-images";

type CinematicHeroProps = {
  consultationHref?: string;
};

export function CinematicHero({ consultationHref = "/diagnostic" }: CinematicHeroProps) {
  const homeCopy = useCopy().home;
  const heroCopy = homeCopy.hero;
  const { locale } = useI18n();
  const waOrderUrl = buildWaLink("order", "", locale);

  return (
    <section
      className="relative isolate min-h-svh overflow-hidden bg-[#0B0B0B] text-[#F5EFE3]"
      data-mobile-cta-section="hero"
      id="hero"
    >
      <Image
        alt=""
        className="object-cover [object-position:50%_25%]"
        fill
        priority
        sizes="100vw"
        src={siteImages.productMacro}
      />
      {/* Dark gradient: left side heavy for text contrast, lifts on right to reveal product */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-r from-[#0B0B0B]/95 via-[#0B0B0B]/72 to-[#0B0B0B]/32" />
      {/* Bottom-to-top scrim behind CTA row — guarantees button contrast at all crop positions */}
      <div className="absolute bottom-0 left-0 right-0 z-[6] h-48 bg-gradient-to-t from-[#0B0B0B]/80 to-transparent" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_45%,rgb(184_147_90/.18),transparent_32%)]" />
      <SceneGate className="pointer-events-none absolute right-[2vw] top-[16vh] z-[14] hidden h-[68vh] w-[42vw] opacity-62 mix-blend-screen md:block" />

      <div className="relative z-20 mx-auto flex min-h-svh w-full max-w-[1440px] items-center overflow-hidden px-5 pb-14 pt-28 md:px-10 md:py-28 xl:px-20">
        <div className="fondjo-section-reveal is-visible mx-auto w-full max-w-[20.5rem] animate-[fondjoFadeUp_.8s_ease-out_both] text-center sm:max-w-[42rem] md:mx-0 md:max-w-[48rem] md:text-left">
          <p className="font-serif text-3xl leading-none text-[#B8935A] sm:text-4xl">
            Maison Fondjo
          </p>
          <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#B8935A]/82 sm:text-[0.66rem] sm:tracking-[0.34em]">
            {heroCopy.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.36rem] font-light leading-[0.98] tracking-normal text-[#F5EFE3] sm:text-[clamp(3.05rem,12vw,5.4rem)] md:mt-7 md:text-[clamp(4.4rem,6.4vw,7.2rem)] md:leading-[0.92]">
            {heroCopy.titleFirst}
            <span className="block text-[#B8935A]">{heroCopy.titleSecond}</span>
          </h1>
          <div aria-hidden="true" className="mx-auto mt-7 text-lg text-[#B8935A] md:mx-0">
            ◆
          </div>
          <p className="mx-auto mt-6 max-w-[19.5rem] text-[0.92rem] leading-7 text-[#F5EFE3]/78 sm:max-w-[38rem] sm:text-[0.98rem] sm:leading-8 md:mx-0 md:text-lg">
            {heroCopy.story}
          </p>

          <div className="mt-8 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-11">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] shadow-[0_22px_80px_rgb(184_147_90/.24)] transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
              href={waOrderUrl}
              rel="noreferrer"
              target="_blank"
            >
              {homeCopy.buy}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-13 items-center justify-center rounded-sm border-2 border-[#F5EFE3]/60 bg-[#0B0B0B]/50 px-7 text-sm font-semibold text-[#F5EFE3] backdrop-blur-md transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
              href={consultationHref}
            >
              {heroCopy.primary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
