"use client";

import { ArrowRight, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { NavAuthButton } from "@/components/nav-auth-button";
import {
  MotionButtonShell,
  MotionCard,
  MotionDiamond,
  MotionStep,
} from "@/components/motion/living-motion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { formulaIngredients, getFormulaIngredientCopy } from "@/content/formula";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getWhatsAppUrl } from "@/features/elixir/lib/cms";
import { useCopy, useI18n } from "@/lib/i18n-context";
import {
  getMarketingDesktopNav,
  getMarketingMobileNav,
  isMarketingNavActive,
} from "@/lib/marketing-nav";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils/cn";

const CinematicHero = dynamic(
  () =>
    import("@/components/CinematicHero").then((mod) => ({
      default: mod.CinematicHero,
    })),
  {
    loading: () => <section aria-hidden className="min-h-svh bg-[#0B0B0B]" id="hero" />,
  },
);

type PremiumStorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

type Copy = ReturnType<typeof useCopy>["home"];

const campaignImages = {
  backLabel: siteImages.backLabel,
  barbershop: siteImages.barbershop,
  banner: siteImages.wordmarkLockup,
  family: siteImages.lifestyleMotherChild,
  flatlay: siteImages.flatlayFormula,
  frontLabel: siteImages.frontLabel,
  hero: siteImages.volcanicBottle,
  hairTexture: siteImages.hairTextureLifestyle,
  market: siteImages.originBueaHarvest,
  night: siteImages.lifestyleScalpRitual,
  origin: siteImages.originMountCameroon,
  ritualBefore: siteImages.ritualBefore,
  ritualAfter: siteImages.ritualAfter,
  productMacro: siteImages.productMacro,
  profileLogo: siteImages.profileLogo,
  reflection: siteImages.studioBottle,
} as const;

/** Plain section wrapper — no scroll-linked motion (keeps scroll smooth). */
function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ScrollReveal className={className}>{children}</ScrollReveal>;
}

function ImagePanel({
  alt,
  className,
  priority = false,
  sizes,
  src,
}: {
  alt: string;
  className?: string;
  priority?: boolean;
  sizes: string;
  src: string;
}) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <Image
        alt={alt}
        className="object-cover md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-[1.035]"
        fill
        {...(priority ? { priority: true } : { loading: "lazy" as const })}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}

function EngravedBotanicalIllustration({ index }: { index: number }) {
  const side = index % 2 === 0 ? 1 : -1;

  return (
    <svg
      aria-hidden="true"
      className="mx-auto h-32 w-36 text-[#7b622d]"
      fill="none"
      viewBox="0 0 160 132"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M80 118 C ${76 + side * 7} 92, ${86 - side * 18} 52, 80 16`}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.1"
      />
      {[0, 1, 2, 3, 4].map((leaf) => (
        <path
          d={`M80 ${102 - leaf * 18} C ${112 + side * leaf * 1.5} ${92 - leaf * 17}, ${112 + side * 4} ${70 - leaf * 13}, 83 ${84 - leaf * 15} C ${98 + side * 4} ${90 - leaf * 17}, ${98 + side * 5} ${104 - leaf * 14}, 80 ${102 - leaf * 18}`}
          key={leaf}
          stroke="currentColor"
          strokeOpacity={0.82 - leaf * 0.08}
          strokeWidth="0.9"
        />
      ))}
      <circle cx="80" cy="16" r="2.4" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function ProductShowcase({ copy }: { copy: Copy }) {
  return (
    <section
      className="border-y border-[#B8935A]/10 bg-[#0B0B0B] py-20 sm:py-28"
      data-mobile-cta-section="product"
      id="product"
    >
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.72fr)] lg:items-center">
        {/* Image stays outside FadeUp — GSAP transforms blank fill photos on mobile */}
        <ImagePanel
          alt={copy.mediaAlts.product}
          className="min-h-[28rem] border border-[#B8935A]/18 bg-[#17130e] sm:min-h-[42rem]"
          sizes="(min-width: 1024px) 58vw, 100vw"
          src={campaignImages.reflection}
        />
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#B8935A]">
            {copy.productEyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[clamp(3rem,8vw,6.8rem)] font-light leading-[0.88] text-[#F5EFE3]">
            {copy.productTitle}
          </h2>
          <p className="mt-4 font-mono text-2xl text-[#B8935A]">{copy.productPrice}</p>
          <MotionDiamond className="mt-7" />
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#F5EFE3]/68">{copy.productText}</p>
          <dl className="mt-9 grid gap-4 border-y border-[#B8935A]/16 py-6 text-sm text-[#F5EFE3]/72">
            {[copy.productSpecOne, copy.productSpecTwo, copy.productSpecThree].map(
              ([label, value]) => (
                <div className="grid grid-cols-[8rem_1fr] gap-4" key={label}>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
                    {label}
                  </dt>
                  <dd className="font-mono text-[#F5EFE3]">{value}</dd>
                </div>
              ),
            )}
          </dl>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MotionButtonShell>
              <Link
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B]"
                href={"/shop" as Route}
              >
                {copy.buy}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </MotionButtonShell>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function OriginSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="relative min-h-[82svh] overflow-hidden bg-[#0B0B0B] text-[#F5EFE3]"
      data-mobile-cta-section="origin"
      id="origin"
    >
      <ImagePanel
        alt={copy.mediaAlts.origin}
        className="absolute inset-0"
        sizes="100vw"
        src={campaignImages.market}
      />
      {/* Mobile: lighter veil so the photo stays visible behind the copy */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_7_6/.35)_0%,rgb(8_7_6/.55)_45%,#0B0B0B_100%)] md:bg-[linear-gradient(90deg,#0B0B0B_0%,rgb(8_7_6/.7)_48%,rgb(8_7_6/.22)_100%),linear-gradient(180deg,rgb(8_7_6/.18),#0B0B0B_100%)]" />
      <Container className="relative flex min-h-[82svh] items-end py-20 sm:py-28">
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.originEyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.originTitle}
          </h2>
          <MotionDiamond className="mt-7" />
          <p className="mt-7 max-w-2xl font-serif text-2xl leading-[1.45] text-[#F5EFE3]/82 sm:text-3xl">
            {copy.originBody}
          </p>
        </FadeUp>
      </Container>
    </section>
  );
}

export function FounderStorySection({ content, locale }: PremiumStorefrontPageProps) {
  return (
    <section className="bg-[#F5EFE3] text-[#0B0B0B]" data-mobile-cta-section="founder" id="founder">
      <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
        {/* Text — left */}
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
          <FadeUp className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
              {t(content.founder.eyebrow, locale)}
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.92] text-[#0B0B0B]">
              {t(content.founder.title, locale)}
            </h2>
            <p className="mt-8 text-sm leading-8 text-[#0B0B0B]/68">
              {t(content.founder.signature, locale)}
            </p>

            {/* Signature block */}
            <div className="mt-10 border-t border-[#0B0B0B]/12 pt-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
                MF
              </p>
              <p className="mt-3 text-xs leading-7 text-[#0B0B0B]/52">
                {t(content.founder.intro ?? content.founder.title, locale)}
              </p>
              <p className="mt-5 font-serif text-lg font-light italic text-[#B8935A]">
                {content.founder.name}
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Photo — right (outside FadeUp so mobile always paints the image) */}
        <div className="relative min-h-[32rem] overflow-hidden lg:min-h-0">
          <Image
            alt={t(content.founder.image.alt, locale)}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={campaignImages.family}
          />
          {/* Edge vignette only — no darkening over faces */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(245_239_227/.22)_100%)]"
          />
        </div>
      </Container>
    </section>
  );
}

export function IngredientCarousel({
  content,
  copy,
  locale,
}: PremiumStorefrontPageProps & { copy: Copy }) {
  void content;
  const ingredients = formulaIngredients;
  const formulaNoteText = copy.formulaNote;

  return (
    <section
      className="overflow-hidden bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="formula"
      id="formula"
    >
      <Container>
        <FadeUp className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.formula}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl font-light leading-[0.9] sm:text-6xl lg:text-7xl">
            {copy.formulaTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#F5EFE3]/65">{copy.formulaBody}</p>
        </FadeUp>

        <div
          className="mt-12 flex gap-4 overflow-x-auto pb-5 [scrollbar-color:#B8935A_transparent] [scrollbar-width:thin]"
          role="list"
        >
          {ingredients.map((ingredient, index) => {
            const ingredientCopy = getFormulaIngredientCopy(ingredient, locale);

            return (
              <MotionCard
                className="group relative min-h-[23rem] w-[18rem] shrink-0 overflow-hidden rounded-sm border border-[#B8935A]/46 bg-[#F5EFE3] p-6 text-[#0B0B0B] shadow-[0_24px_80px_rgb(0_0_0/.2)] sm:w-[21rem]"
                key={`${ingredientCopy.name}-${index}`}
                role="listitem"
                transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <div aria-hidden="true" className="absolute inset-3 border border-[#B8935A]/30" />
                <div className="relative">
                  <p className="text-center text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#5f4a22]">
                    Maison Fondjo Herbier
                  </p>
                  <EngravedBotanicalIllustration index={index} />
                  <h3 className="mt-5 text-center font-serif text-4xl font-light leading-none">
                    {ingredientCopy.name}
                  </h3>
                  <p className="mt-2 text-center font-serif text-lg italic text-[#7b622d]">
                    {ingredient.latin}
                  </p>
                  <MotionDiamond className="mt-5 text-center" />
                  <p className="mt-6 text-center text-sm leading-7 text-[#0B0B0B]/70">
                    {ingredientCopy.chosenFor}
                  </p>
                </div>
              </MotionCard>
            );
          })}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-6 text-[#F5EFE3]/62">{formulaNoteText}</p>
      </Container>
    </section>
  );
}

export function TestimonialsSection({ copy }: { copy: Copy }) {
  const t = copy.testimonials;

  return (
    <section
      className="bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="testimonials"
      id="testimonials"
    >
      <Container>
        <FadeUp className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {t.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-5xl font-light leading-[0.9] sm:text-6xl lg:text-7xl">
            {t.title}
          </h2>
        </FadeUp>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item) => (
            <MotionCard className="border border-[#B8935A]/14 bg-white/[0.025] p-6" key={item.name}>
              <p className="font-serif text-xl font-light italic leading-8 text-[#F5EFE3]/88">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
                {item.name}
              </p>
            </MotionCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function WhyItWorksSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="mechanism"
      id="why-maison-fondjo"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgb(184_147_90/.12),transparent_28%),linear-gradient(180deg,#0B0B0B,#0B0B0B)]"
      />
      <Container className="relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.whyEyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.7rem,7vw,6.4rem)] font-light leading-[0.88]">
            {copy.whyTitle}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#F5EFE3]/66">{copy.whyBody}</p>
        </FadeUp>

        <FadeUp className="relative">
          <div className="relative overflow-hidden rounded-md border border-[#B8935A]/18 bg-white/[0.035] p-5 sm:p-8">
            <div className="absolute inset-x-8 top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,#B8935A,transparent)] lg:block" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.whySteps.map(([title, body], index) => (
                <MotionCard
                  className="group relative rounded-md border border-[#B8935A]/14 bg-[#0B0B0B]/72 p-5"
                  key={title}
                >
                  <span className="relative z-10 grid size-12 place-items-center rounded-full border border-[#B8935A]/36 bg-[#0B0B0B] font-mono text-xs text-[#B8935A] shadow-[0_0_34px_rgb(184_147_90/.12)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 font-serif text-3xl leading-none text-[#F5EFE3]">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#F5EFE3]/62">{body}</p>
                  <div
                    aria-hidden="true"
                    className="mt-6 h-px bg-[linear-gradient(90deg,#B8935A,transparent)] opacity-45"
                  />
                </MotionCard>
              ))}
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function HairConcernsSection({ copy }: { copy: Copy }) {
  const concerns = copy.concerns;

  return (
    <section
      className="bg-[#100d0a] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="concerns"
      id="concerns"
    >
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {concerns.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6rem)] font-light leading-[0.88]">
            {concerns.title}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#F5EFE3]/66">{concerns.body}</p>
        </FadeUp>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concerns.items.map(([title, body]) => (
            <MotionCard className="border border-[#B8935A]/16 bg-white/[0.025] p-6" key={title}>
              <h3 className="font-serif text-2xl font-light text-[#F5EFE3]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#F5EFE3]/66">{body}</p>
            </MotionCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function DiagnosticInviteSection({ copy }: { copy: Copy }) {
  const invite = copy.diagnosticInvite;

  return (
    <section
      className="border-y border-[#B8935A]/14 bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="diagnostic"
      id="diagnostic-invite"
    >
      <Container>
        <FadeUp className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {invite.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.6rem)] font-light leading-[0.9]">
            {invite.title}
          </h2>
          <MotionDiamond className="mt-7" />
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#F5EFE3]/68">
            {invite.body}
          </p>
          <MotionButtonShell className="mt-10">
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-8 text-sm font-semibold text-[#0B0B0B]"
              href={"/diagnostic" as Route}
              prefetch
            >
              {invite.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </MotionButtonShell>
        </FadeUp>
      </Container>
    </section>
  );
}

export function FaqSection({
  content,
  copy,
  locale,
}: {
  content: ElixirContent;
  copy: Copy;
  locale: Locale;
}) {
  return (
    <section
      className="bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="faq"
      id="faq"
    >
      <Container className="max-w-3xl">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.faqSection.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.6rem,7vw,5.2rem)] font-light leading-[0.9]">
            {copy.faqSection.title}
          </h2>
        </FadeUp>
        <Accordion className="mt-10 border-t border-[#B8935A]/16" collapsible type="single">
          {content.faq.items.map((item, index) => (
            <AccordionItem
              className="border-[#B8935A]/16"
              key={`${t(item.question, locale)}-${index}`}
              value={`faq-${index}`}
            >
              <AccordionTrigger className="text-[#F5EFE3] hover:text-[#B8935A]">
                {t(item.question, locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-[#F5EFE3]/68">
                {t(item.answer, locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

export function RitualSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-[#100d0a] text-[#F5EFE3]" data-mobile-cta-section="ritual" id="ritual">
      <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
        <div className="flex min-h-[34rem] items-center justify-center bg-[#100d0a] px-6 py-10 lg:px-8 lg:py-12">
          <div className="grid w-full max-w-sm grid-cols-2 gap-4">
            {[
              { src: campaignImages.ritualBefore, label: copy.testimonials.beforeLabel },
              { src: campaignImages.ritualAfter, label: copy.testimonials.afterLabel },
            ].map(({ src, label }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-sm border border-[#B8935A]/28">
                  <Image
                    alt={label}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    src={src}
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-16">
          <FadeUp className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
              {copy.ritual}
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6rem)] font-light leading-[0.86]">
              {copy.ritualTitle}
            </h2>
            <MotionDiamond className="mt-7" />
            <p className="mt-6 text-sm leading-8 text-[#F5EFE3]/68">{copy.ritualBody}</p>
            <div className="mt-8 grid gap-4">
              {copy.ritualSteps.map((step, index) => (
                <MotionStep className="flex items-center gap-4" delay={index * 0.06} key={step}>
                  <span className="grid size-10 shrink-0 place-items-center border border-[#B8935A]/35 font-mono text-xs text-[#B8935A]">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#F5EFE3]/82">{step}</p>
                </MotionStep>
              ))}
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}

export function LifestyleGallery({ copy }: { copy: Copy }) {
  const moments = [
    {
      image: campaignImages.night,
      text: copy.nightText,
      title: copy.nightTitle,
    },
    {
      image: campaignImages.market,
      text: copy.marketText,
      title: copy.marketTitle,
    },
    {
      image: campaignImages.barbershop,
      text: copy.barbershopText,
      title: copy.barbershopTitle,
    },
    {
      image: campaignImages.family,
      text: copy.packingText,
      title: copy.packingTitle,
    },
  ] as const;

  return (
    <section
      className="bg-[#E4D2B4] py-20 text-[#0B0B0B] sm:py-28"
      data-mobile-cta-section="lifestyle"
      id="lifestyle"
    >
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            {copy.lifestyle}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.5rem,7vw,6.2rem)] font-light leading-[0.88]">
            {copy.lifestyleTitle}
          </h2>
        </FadeUp>
        <MotionDiamond className="mt-7 text-[#7b622d]" />
        <div className="mt-12 grid gap-14">
          {moments.map((moment, index) => (
            <article
              className="grid gap-7 border-t border-[#7b622d]/18 pt-7 md:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.5fr)] md:items-end"
              key={moment.title}
            >
              <ImagePanel
                alt={moment.title}
                className="min-h-[27rem] bg-[#0B0B0B]"
                sizes="(min-width: 1024px) 58vw, 100vw"
                src={moment.image}
              />
              <FadeUp className={index % 2 === 1 ? "md:pb-16" : ""}>
                <p className="font-mono text-xs text-[#5f4a22]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 max-w-md font-serif text-4xl leading-none sm:text-5xl">
                  {moment.title}
                </h3>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#0B0B0B]/64">{moment.text}</p>
              </FadeUp>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ClosingChapter({ copy, whatsappUrl }: { copy: Copy; whatsappUrl: string }) {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B] py-24 text-[#F5EFE3] sm:py-32"
      data-mobile-cta-section="contact"
      id="contact"
    >
      <Container className="relative">
        <FadeUp className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.closingEyebrow}
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.closingTitle}
          </h2>
          <MotionDiamond className="mt-7" />
          <p className="mx-auto mt-7 max-w-2xl font-serif text-2xl leading-[1.45] text-[#F5EFE3]/76 sm:text-3xl">
            {copy.closingBody}
          </p>
          <MotionButtonShell className="mt-10">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-8 text-sm font-semibold text-[#0B0B0B]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              {copy.whatsapp}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </MotionButtonShell>
        </FadeUp>
      </Container>
    </section>
  );
}

export function StickyMobileCTA({ copy }: { copy: Copy }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [dismissedSection, setDismissedSection] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const isPastHero = activeSection !== "hero";
  const isDismissed = dismissedSection === activeSection;

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-mobile-cta-section]"),
    );

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const sectionId = mostVisible?.target.getAttribute("data-mobile-cta-section");

        if (sectionId) {
          setActiveSection(sectionId);
        }
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  if (!isPastHero || isDismissed) {
    return null;
  }

  const barClass =
    "fixed inset-x-3 bottom-3 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-[#B8935A]/18 bg-[#0B0B0B]/90 p-2 shadow-[0_18px_70px_rgb(0_0_0/.45)] backdrop-blur-xl md:hidden";

  const bar = (
    <>
      <div className="px-2">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
          Maison Fondjo
        </p>
        <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#F5EFE3]/52">Buea</p>
      </div>
      <MotionButtonShell>
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#B8935A] px-4 text-center text-xs font-semibold text-[#0B0B0B]"
          href="#contact"
        >
          {copy.contact}
        </a>
      </MotionButtonShell>
      <button
        aria-label="Masquer la barre de commande"
        className="grid size-10 place-items-center rounded-sm border border-white/10 text-[#F5EFE3]/72"
        onClick={() => setDismissedSection(activeSection)}
        type="button"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </>
  );

  if (reduceMotion) {
    return <div className={barClass}>{bar}</div>;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={barClass}
      initial={{ opacity: 0, y: 28 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      {bar}
    </motion.div>
  );
}

function PremiumHeader({ copy }: { copy: Copy }) {
  const pathname = usePathname();
  const desktopNav = getMarketingDesktopNav(copy.nav);
  const mobileNav = getMarketingMobileNav(copy.nav);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B0B0B]/70 text-[#F5EFE3] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link aria-label="Maison Fondjo home" className="flex items-center gap-3" href="/">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full border border-[#B8935A]/35 bg-[#0f2415] font-serif text-xs text-[#B8935A] sm:size-10 sm:text-sm"
          >
            MF
          </span>
          <span className="hidden sm:block text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[#F5EFE3]/58">
            Buea
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/62 lg:flex">
          {desktopNav.map(([label, href]) => {
            const active = isMarketingNavActive(pathname, href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b-2 pb-1 transition-colors hover:text-[#B8935A]",
                  active ? "border-[#B8935A] text-[#F5EFE3]" : "border-transparent",
                )}
                href={href as Route}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-sm bg-[#B8935A] px-3 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4"
            href={"/shop" as Route}
          >
            {copy.buy}
          </Link>
          <NavAuthButton />
        </div>
      </Container>

      <nav
        aria-label="Marketing sections"
        className="flex gap-5 overflow-x-auto border-t border-white/10 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/62 scrollbar-none sm:px-6 lg:hidden"
      >
        {mobileNav.map(([label, href]) => {
          const active = isMarketingNavActive(pathname, href);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 border-b-2 pb-1 transition-colors",
                active
                  ? "border-[#B8935A] text-[#F5EFE3]"
                  : "border-transparent hover:text-[#B8935A]",
              )}
              href={href as Route}
              key={href}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function PremiumStorefrontPage({ content }: PremiumStorefrontPageProps) {
  const { copy: localizedCopy, locale } = useI18n();
  const copy = localizedCopy.home;
  const contentLocale: Locale = locale;
  const whatsappUrl = getWhatsAppUrl(content, contentLocale);

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <PremiumHeader copy={copy} />
      <CinematicHero />
      <ProductShowcase copy={copy} />
      <WhyItWorksSection copy={copy} />
      <HairConcernsSection copy={copy} />
      <IngredientCarousel content={content} copy={copy} locale={contentLocale} />
      <RitualSection copy={copy} />
      <TestimonialsSection copy={copy} />
      <DiagnosticInviteSection copy={copy} />
      <OriginSection copy={copy} />
      <FounderStorySection content={content} locale={contentLocale} />
      <LifestyleGallery copy={copy} />
      <FaqSection content={content} copy={copy} locale={contentLocale} />
      <ClosingChapter copy={copy} whatsappUrl={whatsappUrl} />
      <SiteFooter />
    </main>
  );
}
