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
import Image from "next/image";

import { HairTexturePanels } from "@/components/HairTexturePanels";
import { siteImages } from "@/lib/site-images";

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
  consultationHref = "#diagnosis",
  productHref = "#product",
}: CinematicHeroProps) {
  return (
    <>
      <section
        className="relative isolate min-h-[92svh] overflow-hidden bg-[#0D0D0D] text-[#F7F4EB] md:min-h-screen"
        data-mobile-cta-section="hero"
        id="hero"
      >
        <Image
          alt="FONDJO RACINE Mount Cameroon botanical atmosphere"
          className="object-cover opacity-42"
          fill
          priority
          sizes="100vw"
          src={siteImages.heroOrigin}
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/42" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_61%_52%,rgb(212_175_55/.18),transparent_28%),radial-gradient(circle_at_84%_38%,rgb(27_94_32/.3),transparent_36%),linear-gradient(102deg,#0D0D0D_0%,rgb(13_13_13/.92)_36%,rgb(27_94_32/.58)_68%,#0D0D0D_100%)]" />
        <div
          aria-hidden="true"
          className="absolute left-5 top-24 h-px w-28 bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] opacity-90 md:left-[7vw] md:top-28 md:w-48"
        />
        <HairTexturePanels />

        <div className="relative z-20 mx-auto grid min-h-[92svh] w-full max-w-[1440px] items-center gap-7 px-5 pb-10 pt-28 text-center md:min-h-screen md:grid-cols-[minmax(0,0.94fr)_minmax(18rem,0.72fr)_minmax(12rem,0.28fr)] md:px-10 md:py-24 md:text-left xl:px-20">
          <div className="mx-auto max-w-[43rem] animate-[fondjoFadeUp_.8s_ease-out_both] md:mx-0">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
              FONDJO RACINE · MADE IN BUEA, CAMEROON
            </p>
            <h1 className="mt-6 font-serif text-[clamp(3.1rem,13vw,5.6rem)] font-light leading-[0.91] tracking-normal text-[#F7F4EB] md:text-[clamp(4rem,6.2vw,7rem)]">
              Healthy Hair
              <span className="block text-[#D4AF37]">Begins at</span>
              <span className="block">the Root.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[40rem] text-base leading-8 text-[#F7F4EB]/78 md:mx-0 md:text-lg">
              Crafted in Buea, Cameroon using carefully selected botanical oils chosen to nourish
              the scalp, strengthen strands, and restore healthy-looking hair.
            </p>

            <div className="mt-9 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-10">
              <a
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-7 text-sm font-semibold text-[#0D0D0D] shadow-[0_22px_80px_rgb(212_175_55/.28)] transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                href={productHref}
              >
                Shop SÈVE
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#F7F4EB]/24 bg-[#0D0D0D]/32 px-7 text-sm font-semibold text-[#F7F4EB] backdrop-blur-md transition-transform duration-100 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                href={consultationHref}
              >
                Discover the Formula
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
