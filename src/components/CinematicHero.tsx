"use client";

import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useRef } from "react";

import { MotionButtonShell, MotionDiamond } from "@/components/motion/living-motion";
import { useCopy } from "@/lib/i18n-context";
import { gsap, registerGsap } from "@/lib/motion/gsap";
import { motionIntensity } from "@/lib/motion/media";
import { siteImages } from "@/lib/site-images";

const SceneGate = dynamic(
  () =>
    import("@/components/three/SceneGate").then((mod) => ({
      default: mod.SceneGate,
    })),
  { ssr: false },
);

type CinematicHeroProps = {
  consultationHref?: Route;
};

/**
 * Homepage hero. GSAP load-in for copy + sap line only — no scroll scrubbing,
 * so leaving the hero feels like normal page scroll.
 */
export function CinematicHero({ consultationHref = "/diagnostic" }: CinematicHeroProps) {
  const homeCopy = useCopy().home;
  const heroCopy = homeCopy.hero;

  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const sapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const section = sectionRef.current;
      const media = mediaRef.current;
      const sap = sapRef.current;
      const content = contentRef.current;
      if (!section || !media || !sap || !content) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intensity = motionIntensity();
        const startHidden = intensity !== "mobile";

        gsap.fromTo(
          content,
          { autoAlpha: startHidden ? 0 : 1, y: intensity === "mobile" ? 12 : 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: intensity === "mobile" ? 0.55 : 1,
            ease: "power2.out",
            delay: startHidden ? 0.08 : 0,
            clearProps: intensity === "mobile" ? "transform" : "opacity,visibility,transform",
          },
        );

        gsap.fromTo(
          sap,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: intensity === "mobile" ? 0.9 : 1.25,
            ease: "power2.inOut",
            delay: 0.2,
          },
        );

        const sapLine = sap.firstElementChild;
        if (sapLine) {
          gsap.to(sapLine, {
            opacity: 0.45,
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: intensity === "mobile" ? 1.1 : 1.5,
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className="relative isolate flex h-svh max-h-svh flex-col overflow-hidden bg-[#0B0B0B] text-[#F5EFE3]"
      data-mobile-cta-section="hero"
      id="hero"
      ref={sectionRef}
    >
      <div className="absolute inset-0 md:will-change-transform" ref={mediaRef}>
        <Image
          alt=""
          className="scale-105 object-cover object-[58%_22%] sm:object-[50%_25%]"
          fill
          priority
          sizes="100vw"
          src={siteImages.productMacro}
        />
      </div>
      {/* Mobile: lighter overlay so the product photo stays visible. Desktop: stronger left scrim for type. */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-[#0B0B0B]/55 via-[#0B0B0B]/35 to-[#0B0B0B]/70 md:bg-gradient-to-r md:from-[#0B0B0B]/95 md:via-[#0B0B0B]/72 md:to-[#0B0B0B]/32" />
      <div className="absolute bottom-0 left-0 right-0 z-[6] h-40 bg-gradient-to-t from-[#0B0B0B]/75 to-transparent md:h-48 md:from-[#0B0B0B]/80" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_45%,rgb(184_147_90/.18),transparent_32%)]" />

      {/* Signature gold sap line — rooted / rising motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18vh] z-[15] h-[42vh] w-px -translate-x-1/2 md:left-[min(12vw,7rem)] md:translate-x-0"
        ref={sapRef}
      >
        <div className="h-full w-full bg-[linear-gradient(180deg,transparent_0%,var(--fr-gold,#B8935A)_18%,var(--fr-gold,#B8935A)_82%,transparent_100%)] opacity-80 shadow-[0_0_18px_rgb(184_147_90/.35)]" />
      </div>

      <SceneGate className="pointer-events-none absolute right-[2vw] top-[16vh] z-[14] hidden h-[68vh] w-[42vw] opacity-62 mix-blend-screen md:block" />

      <div className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-40 sm:px-8 sm:pt-36 md:justify-center md:px-10 md:py-28 xl:px-20">
        <div
          className="mx-auto flex min-h-0 w-full max-w-[20.5rem] flex-1 flex-col text-center sm:max-w-[42rem] md:mx-0 md:max-w-[48rem] md:flex-none md:text-left"
          ref={contentRef}
        >
          <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden md:block md:flex-none md:overflow-visible">
            <p className="font-serif text-2xl leading-none text-[#B8935A] sm:text-3xl">
              Maison Fondjo
            </p>
            <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#B8935A]/82 sm:mt-5 sm:text-[0.66rem] sm:tracking-[0.34em]">
              {heroCopy.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-[2.05rem] font-light leading-[0.98] tracking-normal text-[#F5EFE3] sm:mt-6 sm:text-[clamp(3.05rem,12vw,5.4rem)] md:mt-7 md:text-[clamp(4.4rem,6.4vw,7.2rem)] md:leading-[0.92]">
              {heroCopy.titleFirst}
              <span className="block text-[#B8935A]">{heroCopy.titleSecond}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[20rem] text-[0.84rem] leading-6 text-[#F5EFE3]/72 sm:mt-5 sm:max-w-[36rem] sm:text-base sm:leading-7 md:mx-0 md:max-w-[42rem]">
              {heroCopy.subtitle}
            </p>
            <MotionDiamond className="mx-auto mt-4 sm:mt-7 md:mx-0" />
            <p className="mx-auto mt-3 max-w-[19.5rem] text-[0.84rem] leading-6 text-[#F5EFE3]/78 sm:mt-6 sm:max-w-[38rem] sm:text-[0.98rem] sm:leading-8 md:mx-0 md:text-lg">
              {heroCopy.story}
            </p>
          </div>

          {/* Pinned to the first viewport so CTAs stay visible on mobile */}
          <div className="mt-4 shrink-0 grid gap-3 sm:mt-8 sm:inline-grid sm:grid-cols-2 md:mt-11">
            <MotionButtonShell>
              <Link
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] shadow-[0_22px_80px_rgb(184_147_90/.24)] sm:min-h-13"
                href={"/shop" as Route}
                prefetch
              >
                {homeCopy.buy}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </MotionButtonShell>
            <MotionButtonShell>
              <Link
                className="inline-flex min-h-12 w-full items-center justify-center rounded-sm border-2 border-[#F5EFE3]/60 bg-[#0B0B0B]/50 px-7 text-sm font-semibold text-[#F5EFE3] backdrop-blur-md sm:min-h-13"
                href={consultationHref}
                prefetch
              >
                {heroCopy.primary}
              </Link>
            </MotionButtonShell>
          </div>
        </div>
      </div>
    </section>
  );
}
