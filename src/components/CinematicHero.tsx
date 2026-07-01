"use client";

import { ArrowRight, Globe2, MessageCircle, Sparkles, Truck } from "lucide-react";
import Image from "next/image";

import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { siteImages } from "@/lib/site-images";

const trustItems = [
  "Founded & Made in Buea, Cameroon",
  "National Delivery",
  "International Shipping",
  "All Hair Types | Unisex",
  "Free Hair Consultation",
] as const;

type CinematicHeroProps = {
  consultationHref?: string;
  productHref?: string;
};

function getTrustIcon(index: number) {
  switch (index) {
    case 1:
      return Truck;
    case 2:
      return Globe2;
    case 4:
      return MessageCircle;
    case 0:
    case 3:
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
        <HeroVideoBackground
          fallbackAlt="Mount Cameroon origin landscape for FONDJO RACINE in Buea"
          fallbackSrc={siteImages.originMountCameroon}
          posterSrc={siteImages.originMountCameroon}
          textureAlt="FONDJO RACINE lifestyle hair texture campaign"
          textureSrc={siteImages.barbershop}
        />

        <div className="absolute inset-0 bg-[#0D0D0D]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgb(212_175_55/.22),transparent_34%),linear-gradient(105deg,#0D0D0D_0%,rgb(27_94_32/.82)_32%,rgb(13_13_13/.42)_61%,#0D0D0D_100%)]" />
        <div
          aria-hidden="true"
          className="absolute left-5 top-24 h-px w-28 bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)] opacity-90 md:left-[7vw] md:top-28 md:w-48"
        />

        <div className="relative z-10 mx-auto grid min-h-[92svh] w-full max-w-[1440px] items-center gap-8 px-5 pb-12 pt-28 text-center md:min-h-screen md:grid-cols-[0.96fr_0.9fr] md:px-10 md:py-24 md:text-left xl:px-20">
          <div className="mx-auto max-w-[42rem] animate-[fondjoFadeUp_.8s_ease-out_both] md:mx-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-[#D4AF37]">
              FONDJO RACINE · SÈVE HAIR TREATMENT OIL
            </p>
            <h1 className="mt-6 font-serif text-[clamp(3.15rem,14vw,5.85rem)] font-light leading-[0.9] tracking-normal text-[#F7F4EB] md:text-[clamp(4.5rem,7vw,7.5rem)]">
              One Universal Oil.
              <span className="block text-[#D4AF37]">Infinite Textures.</span>
              <span className="block">Born in Buea.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[39rem] text-base leading-8 text-[#F7F4EB]/78 md:mx-0 md:text-lg">
              SÈVE is a botanical hair treatment oil crafted in Buea, Cameroon to nourish the scalp,
              strengthen roots, and restore softness across every hair type.
            </p>

            <div className="mt-9 grid gap-3 sm:inline-grid sm:grid-cols-2 md:mt-10">
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

          <div className="relative mx-auto aspect-[4/5] w-[min(74vw,18.5rem)] animate-[fondjoFadeUp_1s_ease-out_.18s_both] md:w-full md:max-w-[31rem]">
            <div className="absolute inset-[12%] rounded-full bg-[#D4AF37]/28 blur-3xl motion-safe:animate-[fondjoGlow_5.5s_ease-in-out_infinite]" />
            <div className="absolute inset-[5%] rounded-full bg-[#1B5E20]/28 blur-2xl" />
            <Image
              alt="FONDJO RACINE SÈVE botanical hair treatment oil bottle"
              className="object-contain drop-shadow-[0_34px_70px_rgb(0_0_0/.55)] md:motion-safe:animate-[fondjoFloat_7s_ease-in-out_infinite]"
              fill
              priority
              sizes="(min-width: 1024px) 34vw, 74vw"
              src={siteImages.hero}
            />
          </div>
        </div>
      </section>

      <section
        aria-label="FONDJO RACINE trust signals"
        className="border-y border-[#D4AF37]/16 bg-[#0D0D0D] px-4 py-4 text-[#F7F4EB]"
      >
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
