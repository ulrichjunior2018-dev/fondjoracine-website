"use client";

import { ArrowRight } from "lucide-react";
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
    <section
      className="relative isolate min-h-svh overflow-hidden bg-[#0D0D0D] text-[#F7F4EB]"
      data-mobile-cta-section="hero"
      id="hero"
    >
      <Image
        alt={heroCopy.backgroundAlt}
        className="object-cover opacity-45"
        fill
        priority
        sizes="100vw"
        src={siteImages.originMountCameroon}
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(100deg,#080706_0%,rgb(8_7_6/.84)_42%,rgb(8_7_6/.36)_100%),radial-gradient(circle_at_72%_45%,rgb(212_175_55/.18),transparent_32%)]" />
      <SceneGate className="pointer-events-none absolute right-[2vw] top-[16vh] z-[14] hidden h-[68vh] w-[42vw] opacity-62 mix-blend-screen md:block" />

      <div className="relative z-20 mx-auto grid min-h-svh w-full max-w-[1440px] items-center gap-10 overflow-hidden px-5 pb-14 pt-28 text-center md:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.72fr)] md:px-10 md:py-28 md:text-left xl:px-20">
        <div className="mx-auto w-full max-w-[20.5rem] animate-[fondjoFadeUp_.8s_ease-out_both] sm:max-w-[42rem] md:mx-0">
          <p className="font-serif text-3xl leading-none text-[#D4AF37] sm:text-4xl">
            Maison Fondjo
          </p>
          <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]/82 sm:text-[0.66rem] sm:tracking-[0.34em]">
            {heroCopy.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.36rem] font-light leading-[0.98] tracking-normal text-[#F7F4EB] sm:text-[clamp(3.05rem,12vw,5.4rem)] md:mt-7 md:text-[clamp(4.4rem,6.4vw,7.2rem)] md:leading-[0.92]">
            {heroCopy.titleFirst}
            <span className="block text-[#D4AF37]">{heroCopy.titleSecond}</span>
            <span className="block">{heroCopy.titleThird}</span>
          </h1>
          <div aria-hidden="true" className="mx-auto mt-7 text-lg text-[#D4AF37] md:mx-0">
            ◆
          </div>
          <p className="mx-auto mt-6 max-w-[19.5rem] text-[0.92rem] leading-7 text-[#F7F4EB]/78 sm:max-w-[38rem] sm:text-[0.98rem] sm:leading-8 md:mx-0 md:text-lg">
            {heroCopy.story}
          </p>

          <div className="mt-8 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-11">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-7 text-sm font-semibold text-[#0D0D0D] shadow-[0_22px_80px_rgb(212_175_55/.24)] transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
              href={consultationHref}
            >
              {heroCopy.primary}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#F7F4EB]/24 bg-[#0D0D0D]/28 px-7 text-sm font-semibold text-[#F7F4EB] backdrop-blur-md transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
              href={productHref}
            >
              {heroCopy.secondary}
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-[min(74vw,20rem)] animate-[fondjoFadeUp_1s_ease-out_.18s_both] md:mx-0 md:w-full md:max-w-[31rem]">
          <div className="absolute inset-[8%] bg-[#D4AF37]/18 blur-3xl" />
          <div className="relative h-full overflow-hidden border border-[#d6b75b]/32 bg-[#050403] shadow-[0_34px_90px_rgb(0_0_0/.58)]">
            <Image
              alt={heroCopy.bottleAlt}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 31rem, 74vw"
              src={siteImages.studioBottle}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgb(5_4_3/.78)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
