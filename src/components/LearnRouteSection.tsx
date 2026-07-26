"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";

import { MotionButtonShell, MotionDiamond, MotionInView } from "@/components/motion/living-motion";
import { advisorImages, advisorPricing } from "@/lib/advisor-site";
import { useCopy } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

const goldButtonClass =
  "inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B]";
const eyebrowClass = "text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B8935A]";

/**
 * Learn hero video: muted, looped, playsInline for mobile.
 * Drop an MP4 at /public/videos/learn-hero.mp4 (or set NEXT_PUBLIC_LEARN_HERO_VIDEO).
 * Poster uses the product still until the video is ready.
 */
function LearnHeroMedia({ alt }: { alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const videoSrc = process.env.NEXT_PUBLIC_LEARN_HERO_VIDEO?.trim() || "/videos/learn-hero.mp4";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    let cancelled = false;
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const tryPlay = async () => {
      try {
        await video.play();
        if (!cancelled) {
          setCanPlayVideo(true);
        }
      } catch {
        if (!cancelled) {
          setCanPlayVideo(false);
        }
      }
    };

    void tryPlay();

    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  return (
    <div className="relative aspect-[4/5] overflow-hidden border border-[#B8935A]/16 bg-black sm:aspect-[5/6]">
      <Image
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-700",
          canPlayVideo ? "opacity-0" : "opacity-100",
        )}
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 100vw"
        src={advisorImages.product}
      />
      <video
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          canPlayVideo ? "opacity-100" : "opacity-0",
        )}
        loop
        muted
        playsInline
        poster={advisorImages.product}
        preload="metadata"
        ref={videoRef}
        src={videoSrc}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/55 via-transparent to-[#0B0B0B]/25"
      />
    </div>
  );
}

export function LearnRouteSection() {
  const copy = useCopy();
  const home = copy.home;
  const learn = home.learn;

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 notranslate" translate="no">
      <div className="mx-auto max-w-6xl">
        <MotionInView>
          <p className={eyebrowClass}>{learn.eyebrow}</p>
          <div className="mt-4 h-[2px] max-w-24 bg-[#B8935A]/80" />
          <h1 className="mt-8 max-w-3xl font-serif text-[1.85rem] font-light leading-[1.15] text-[#F5EFE3] sm:text-5xl lg:text-[3.25rem]">
            {learn.title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
            {learn.intro}
          </p>
        </MotionInView>

        <div className="mt-12 grid gap-10 border-t border-[#B8935A]/14 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <MotionInView>
            <p className={eyebrowClass}>{learn.productEyebrow}</p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-4xl">
              {learn.productTitle}
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
              {learn.productBody}
            </p>
            <p className="mt-6 font-mono text-2xl text-[#B8935A]">{advisorPricing.productXaf}</p>
            <div className="mt-6">
              <MotionButtonShell>
                <Link className={goldButtonClass} href={"/shop" as Route} prefetch>
                  {learn.productCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </MotionButtonShell>
            </div>
          </MotionInView>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <LearnHeroMedia alt={copy.seveRacine.alt} />
          </div>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12 sm:mt-20 sm:pt-14">
          <MotionInView>
            <p className={eyebrowClass}>{home.whyEyebrow}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
              {home.whyTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
              {home.whyBody}
            </p>
          </MotionInView>

          <ol className="mt-10 divide-y divide-[#B8935A]/14 border-y border-[#B8935A]/14">
            {home.whySteps.map(([label, text], index) => (
              <li
                className="grid gap-3 py-6 sm:grid-cols-[4.5rem_minmax(0,12rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8 sm:py-7"
                key={label}
              >
                <span className="font-mono text-xs tracking-[0.14em] text-[#B8935A]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#F5EFE3]">{label}</h3>
                <p className="text-sm leading-7 text-[#F5EFE3]/66 sm:max-w-xl">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12 sm:mt-20 sm:pt-14">
          <MotionInView>
            <p className={eyebrowClass}>{home.ritual}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
              {home.ritualTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
              {home.ritualBody}
            </p>
          </MotionInView>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {home.ritualSteps.map((step, index) => (
              <li className="border-t border-[#B8935A]/20 pt-5" key={step}>
                <p className="font-mono text-xs tracking-[0.14em] text-[#B8935A]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 font-serif text-xl font-light leading-snug text-[#F5EFE3] sm:text-2xl">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12 sm:mt-20 sm:pt-14">
          <MotionInView>
            <p className={eyebrowClass}>{learn.exploreEyebrow}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
              {learn.exploreTitle}
            </h2>
          </MotionInView>

          <ul className="mt-10 divide-y divide-[#B8935A]/14 border-y border-[#B8935A]/14">
            {learn.cards.map(([title, body, cta, href]) => (
              <li key={href + title}>
                <Link
                  className="group grid gap-3 py-7 transition sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-8"
                  href={href as Route}
                  prefetch
                >
                  <h3 className="font-serif text-2xl font-light text-[#F5EFE3] group-hover:text-[#B8935A]">
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-[#F5EFE3]/66">{body}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B8935A]">
                    {cta}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12 sm:mt-20 sm:pt-14">
          <MotionInView>
            <p className={eyebrowClass}>{home.testimonials.eyebrow}</p>
            <h2 className="mt-5 max-w-3xl font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
              {home.testimonials.title}
            </h2>
          </MotionInView>

          <div className="mt-10 divide-y divide-[#B8935A]/14 border-y border-[#B8935A]/14">
            {home.testimonials.items.map((item) => (
              <figure
                className="grid gap-4 py-8 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-10"
                key={item.name}
              >
                <figcaption className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
                  {item.name}
                </figcaption>
                <blockquote className="font-serif text-xl font-light leading-relaxed text-[#F5EFE3]/82 sm:text-2xl">
                  “{item.quote}”
                </blockquote>
              </figure>
            ))}
          </div>
        </div>

        <MotionInView className="mt-16 border-t border-[#B8935A]/14 pt-12 sm:mt-20 sm:pt-14">
          <p className={eyebrowClass}>{learn.diagnosticEyebrow}</p>
          <h2 className="mt-5 max-w-2xl font-serif text-3xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
            {learn.diagnosticTitle}
          </h2>
          <MotionDiamond className="mt-5" />
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
            {learn.diagnosticBody}
          </p>
          <MotionButtonShell className="mt-7">
            <Link className={goldButtonClass} href={"/diagnostic" as Route} prefetch>
              {learn.diagnosticCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </MotionButtonShell>
        </MotionInView>
      </div>
    </section>
  );
}
