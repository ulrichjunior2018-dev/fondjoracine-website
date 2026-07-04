"use client";

import {
  ArrowRight,
  CreditCard,
  Droplets,
  Leaf,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { HairTexturePanels } from "@/components/HairTexturePanels";
import { siteImages } from "@/lib/site-images";

const WebGLHeroEnhancement = dynamic(
  () => import("@/components/WebGLHeroEnhancement").then((module) => module.WebGLHeroEnhancement),
  { ssr: false },
);

const trustItems = [
  "Made in Cameroon",
  "Premium Botanical Oils",
  "Suitable for All Hair Types",
  "100ml",
  "Cruelty Free",
  "Secure Payments",
] as const;

type CinematicHeroProps = {
  consultationHref?: string;
  productHref?: string;
};

function getTrustIcon(index: number) {
  switch (index) {
    case 1:
      return Leaf;
    case 2:
      return Languages;
    case 3:
      return Droplets;
    case 5:
      return CreditCard;
    case 4:
      return ShieldCheck;
    case 0:
    default:
      return Sparkles;
  }
}

export function CinematicHero({
  consultationHref = "#formula",
  productHref = "#product",
}: CinematicHeroProps) {
  return (
    <>
      <section
        className="relative isolate h-[145svh] overflow-visible bg-[#0D0D0D] text-[#F7F4EB]"
        data-mobile-cta-section="hero"
        id="hero"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <Image
            alt="FONDJO RACINE Mount Cameroon botanical atmosphere"
            className="object-cover opacity-42"
            fill
            priority
            sizes="100vw"
            src={siteImages.heroOrigin}
          />
          <WebGLHeroEnhancement />
          <div className="absolute inset-0 z-10 bg-[#0D0D0D]/42" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_61%_52%,rgb(212_175_55/.18),transparent_28%),radial-gradient(circle_at_84%_38%,rgb(27_94_32/.3),transparent_36%),linear-gradient(102deg,#0D0D0D_0%,rgb(13_13_13/.92)_36%,rgb(27_94_32/.58)_68%,#0D0D0D_100%)]" />
          <div
            aria-hidden="true"
            className="absolute left-5 top-24 z-20 h-px w-28 bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] opacity-90 md:left-[7vw] md:top-28 md:w-48"
          />
          <HairTexturePanels />

          <div className="relative z-20 mx-auto grid min-h-svh w-full max-w-[1440px] items-center gap-6 px-5 pb-8 pt-[5.7rem] text-center md:grid-cols-[minmax(0,0.94fr)_minmax(18rem,0.72fr)_minmax(12rem,0.28fr)] md:gap-7 md:px-10 md:py-24 md:text-left xl:px-20">
            <div className="mx-auto max-w-[43rem] animate-[fondjoFadeUp_.8s_ease-out_both] md:mx-0">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
                FONDJO RACINE · MADE IN BUEA, CAMEROON
              </p>
              <h1 className="mt-5 font-serif text-[clamp(2.72rem,11.4vw,5.1rem)] font-light leading-[0.92] tracking-normal text-[#F7F4EB] md:mt-6 md:text-[clamp(4rem,6.2vw,7rem)] md:leading-[0.91]">
                One Universal Oil.
                <span className="block text-[#D4AF37]">Infinite Textures.</span>
                <span className="block">Born in Buea.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[40rem] text-[0.96rem] leading-7 text-[#F7F4EB]/78 md:mx-0 md:mt-6 md:text-lg md:leading-8">
                SÈVE is a botanical hair treatment oil crafted in Buea to nourish the scalp,
                strengthen roots, and restore softness across every hair type.
              </p>

              <div className="mt-6 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-10">
                <a
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-7 text-sm font-semibold text-[#0D0D0D] shadow-[0_22px_80px_rgb(212_175_55/.28)] transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  href={productHref}
                >
                  Discover SÈVE
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#F7F4EB]/24 bg-[#0D0D0D]/32 px-7 text-sm font-semibold text-[#F7F4EB] backdrop-blur-md transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  href={consultationHref}
                >
                  Start Hair Consultation
                </a>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-[min(70vw,18.5rem)] animate-[fondjoFadeUp_1s_ease-out_.18s_both] md:mx-0 md:w-full md:max-w-[30rem]">
              <div className="absolute inset-[11%] rounded-full bg-[#D4AF37]/24 blur-3xl motion-safe:animate-[fondjoGlow_5.5s_ease-in-out_infinite]" />
              <div className="absolute inset-x-[15%] bottom-[5%] h-[16%] rounded-full bg-[#D4AF37]/16 blur-2xl" />
              <div className="absolute inset-[3%] rounded-full bg-[#1B5E20]/22 blur-2xl" />
              <Image
                alt="FONDJO RACINE SÈVE botanical hair treatment oil bottle"
                className="object-contain drop-shadow-[0_34px_70px_rgb(0_0_0/.6)] md:motion-safe:animate-[fondjoFloat_7s_ease-in-out_infinite]"
                fill
                priority
                sizes="(min-width: 1024px) 28vw, 70vw"
                src={siteImages.studioBottle}
              />
              <div className="pointer-events-none absolute inset-x-[22%] bottom-[1%] h-px bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] opacity-80" />
            </div>

            <div aria-hidden="true" className="hidden md:block" />
          </div>
        </div>
      </section>

      <section
        aria-label="FONDJO RACINE trust signals"
        className="border-y border-[#D4AF37]/16 bg-[#0D0D0D] px-4 py-4 text-[#F7F4EB]"
      >
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {trustItems.map((item, index) => {
            const Icon = getTrustIcon(index);

            return (
              <div
                className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/8 bg-white/[0.025] px-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#F7F4EB]/76"
                key={item}
              >
                <Icon className="size-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
