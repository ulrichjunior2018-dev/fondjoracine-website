"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import {
  MotionButtonShell,
  MotionCard,
  MotionDiamond,
  MotionInView,
  MotionStep,
} from "@/components/motion/living-motion";
import { advisorImages, advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { useCopy, useI18n } from "@/lib/i18n-context";

const cardClass = "border border-[#B8935A]/16 bg-white/[0.025] p-6";
const goldButtonClass =
  "inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B]";
const outlineButtonClass =
  "inline-flex min-h-13 items-center justify-center rounded-sm border border-[#B8935A]/24 px-7 text-sm font-semibold text-[#F5EFE3]";
const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]";

export function LearnRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const home = copy.home;
  const learn = home.learn;
  const orderUrl = buildWhatsAppUrl("order", "", locale);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MotionInView>
          <p className={eyebrowClass}>{learn.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
            {learn.title}
          </h1>
          <MotionDiamond className="mt-6" />
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F5EFE3]/68">{learn.intro}</p>
        </MotionInView>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <MotionInView>
            <p className={eyebrowClass}>{learn.productEyebrow}</p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-5xl">
              {learn.productTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#F5EFE3]/68">{learn.productBody}</p>
            <p className="mt-6 font-mono text-2xl text-[#B8935A]">{advisorPricing.productXaf}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MotionButtonShell>
                <Link className={goldButtonClass} href={"/shop" as Route} prefetch>
                  {learn.productCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </MotionButtonShell>
              <MotionButtonShell>
                <a className={outlineButtonClass} href={orderUrl} rel="noreferrer" target="_blank">
                  {home.buy}
                </a>
              </MotionButtonShell>
            </div>
          </MotionInView>
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden border border-[#B8935A]/16 bg-black">
              <Image
                alt={copy.seveRacine.alt}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                src={advisorImages.product}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12">
          <MotionInView>
            <p className={eyebrowClass}>{home.whyEyebrow}</p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
              {home.whyTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5EFE3]/68">{home.whyBody}</p>
          </MotionInView>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {home.whySteps.map(([label, text], index) => (
              <MotionCard className={cardClass} key={label}>
                <p className="font-mono text-xs text-[#B8935A]">0{index + 1}</p>
                <p className="mt-3 text-sm font-semibold text-[#F5EFE3]">{label}</p>
                <p className="mt-2 text-sm leading-6 text-[#F5EFE3]/66">{text}</p>
              </MotionCard>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12">
          <MotionInView>
            <p className={eyebrowClass}>{home.ritual}</p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
              {home.ritualTitle}
            </h2>
          </MotionInView>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {home.ritualSteps.map((step, index) => (
              <MotionStep className={cardClass} delay={index * 0.06} key={step}>
                <p className="font-mono text-xs text-[#B8935A]">0{index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-[#F5EFE3]/68">{step}</p>
              </MotionStep>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12">
          <MotionInView>
            <p className={eyebrowClass}>{learn.exploreEyebrow}</p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
              {learn.exploreTitle}
            </h2>
          </MotionInView>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learn.cards.map(([title, body, cta, href]) => (
              <MotionCard
                className="group flex min-h-[15rem] flex-col justify-between border border-[#B8935A]/16 bg-white/[0.025] p-6"
                key={href + title}
              >
                <Link
                  className="flex h-full flex-col justify-between"
                  href={href as Route}
                  prefetch
                >
                  <div>
                    <h3 className="font-serif text-2xl font-light leading-snug">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#F5EFE3]/66">{body}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B8935A]">
                    {cta}
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#B8935A]/14 pt-12">
          <MotionInView>
            <p className={eyebrowClass}>{home.testimonials.eyebrow}</p>
            <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
              {home.testimonials.title}
            </h2>
          </MotionInView>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {home.testimonials.items.map((item) => (
              <MotionCard className={cardClass} key={item.name}>
                <blockquote className="text-sm leading-7 text-[#F5EFE3]/72">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
                  {item.name}
                </figcaption>
              </MotionCard>
            ))}
          </div>
        </div>

        <MotionInView className="mt-16 border border-[#B8935A]/16 bg-[#B8935A]/[0.045] p-8 sm:p-10">
          <p className={eyebrowClass}>{learn.diagnosticEyebrow}</p>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl font-light leading-tight sm:text-5xl">
            {learn.diagnosticTitle}
          </h2>
          <MotionDiamond className="mt-5" />
          <p className="mt-5 max-w-xl text-base leading-8 text-[#F5EFE3]/68">
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
