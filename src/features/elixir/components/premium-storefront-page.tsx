"use client";

import { ArrowRight, Menu, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CinematicHero } from "@/components/CinematicHero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { siteConfig } from "@/config/site";
import { formulaIngredients, getFormulaIngredientCopy } from "@/content/formula";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getWhatsAppUrl } from "@/features/elixir/lib/cms";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { siteImages } from "@/lib/site-images";

type PremiumStorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

type Copy = ReturnType<typeof useCopy>["home"];

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHBhdGggZD0nTTAgMTZMMTYgME0tNCAxMkwxMi00TTQgMjBMMjAgNCcgc3Ryb2tlPScjYzhhOTUxJyBzdHJva2Utb3BhY2l0eT0nLjE2Jy8+PC9zdmc+";

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
  productMacro: siteImages.productMacro,
  profileLogo: siteImages.profileLogo,
  reflection: siteImages.studioBottle,
} as const;

function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fondjo-section-reveal ${isVisible ? "is-visible" : ""} ${className ?? ""}`}
      ref={ref}
    >
      {children}
    </div>
  );
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
    <div className={`group ${className ?? ""}`}>
      <Image
        alt={alt}
        blurDataURL={blurDataUrl}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        fill
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        priority={priority}
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

export function ProductShowcase({ copy, whatsappUrl }: { copy: Copy; whatsappUrl: string }) {
  return (
    <section
      className="border-y border-[#B8935A]/10 bg-[#0B0B0B] py-20 sm:py-28"
      data-mobile-cta-section="product"
      id="product"
    >
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.72fr)] lg:items-center">
        <FadeUp>
          <ImagePanel
            alt={copy.mediaAlts.product}
            className="relative min-h-[34rem] overflow-hidden border border-[#B8935A]/18 bg-[#17130e] sm:min-h-[42rem]"
            sizes="(min-width: 1024px) 58vw, 100vw"
            src={campaignImages.reflection}
          />
        </FadeUp>
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#B8935A]">
            {copy.productEyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[clamp(3rem,8vw,6.8rem)] font-light leading-[0.88] text-[#F5EFE3]">
            {copy.productTitle}
          </h2>
          <div aria-hidden="true" className="mt-7 text-lg text-[#B8935A]">
            ◆
          </div>
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
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              {copy.contact}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0B0B0B_0%,rgb(8_7_6/.7)_48%,rgb(8_7_6/.22)_100%),linear-gradient(180deg,rgb(8_7_6/.18),#0B0B0B_100%)]" />
      <Container className="relative flex min-h-[82svh] items-end py-20 sm:py-28">
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {copy.originEyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.originTitle}
          </h2>
          <div aria-hidden="true" className="mt-7 text-lg text-[#B8935A]">
            ◆
          </div>
          <p className="mt-7 max-w-2xl font-serif text-2xl leading-[1.45] text-[#F5EFE3]/82 sm:text-3xl">
            {copy.originBody}
          </p>
        </FadeUp>
      </Container>
    </section>
  );
}

export function FounderStorySection({ content, locale }: PremiumStorefrontPageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const founderIntro = content.founder.intro ?? content.founder.title;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-20% 0px -20% 0px", threshold: 0.28 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-[92svh] overflow-hidden bg-[#0B0B0B] text-[#F5EFE3]"
      data-mobile-cta-section="founder"
      id="founder"
      ref={sectionRef}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          alt=""
          blurDataURL={blurDataUrl}
          className="object-cover"
          fill
          placeholder="blur"
          sizes="100vw"
          src={campaignImages.family}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(8_7_6/.88)_0%,rgb(8_7_6/.66)_48%,rgb(8_7_6/.2)_100%),linear-gradient(180deg,rgb(8_7_6/.18)_0%,rgb(8_7_6/.72)_100%)]" />

      <Container className="relative flex min-h-[92svh] items-center py-24 sm:py-32">
        <div
          className={`max-w-4xl transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="font-serif text-4xl leading-none text-[#B8935A] sm:text-6xl">
            Maison Fondjo
          </p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
            {t(content.founder.eyebrow, locale)}
          </p>
          <h2 className="mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.08] text-[#F5EFE3] sm:text-7xl lg:text-8xl">
            {t(content.founder.title, locale)}
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-2xl leading-[1.55] text-[#F5EFE3]/82 sm:text-3xl">
            {t(content.founder.signature, locale)}
          </p>
          <p className="mt-8 max-w-2xl text-sm leading-8 text-[#F5EFE3]/68 sm:text-base">
            {t(founderIntro, locale)}
          </p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-[#B8935A]/82">
            {content.founder.name}
          </p>
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
              <article
                className="group relative min-h-[23rem] w-[18rem] shrink-0 overflow-hidden rounded-sm border border-[#B8935A]/46 bg-[#F5EFE3] p-6 text-[#0B0B0B] shadow-[0_24px_80px_rgb(0_0_0/.2)] sm:w-[21rem]"
                key={`${ingredientCopy.name}-${index}`}
                role="listitem"
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
                  <div aria-hidden="true" className="mt-5 text-center text-[#B8935A]">
                    ◆
                  </div>
                  <p className="mt-6 text-center text-sm leading-7 text-[#0B0B0B]/70">
                    {ingredientCopy.chosenFor}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-6 text-[#F5EFE3]/62">{formulaNoteText}</p>
      </Container>
    </section>
  );
}

export function WhyItWorksSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B] py-20 text-[#F5EFE3] sm:py-28"
      data-mobile-cta-section="mechanism"
      id="why-it-works"
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
            <div className="grid gap-4 lg:grid-cols-4">
              {copy.whySteps.map(([title, body], index) => (
                <article
                  className="group relative rounded-md border border-[#B8935A]/14 bg-[#0B0B0B]/72 p-5 transition-transform duration-300 hover:-translate-y-1"
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
                </article>
              ))}
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function RitualSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-[#100d0a] text-[#F5EFE3]" data-mobile-cta-section="ritual" id="ritual">
      <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
        <ImagePanel
          alt={copy.mediaAlts.scalpRitual}
          className="relative min-h-[34rem] overflow-hidden"
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={campaignImages.night}
        />
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-16">
          <FadeUp className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#B8935A]">
              {copy.ritual}
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6rem)] font-light leading-[0.86]">
              {copy.ritualTitle}
            </h2>
            <div aria-hidden="true" className="mt-7 text-lg text-[#B8935A]">
              ◆
            </div>
            <p className="mt-6 text-sm leading-8 text-[#F5EFE3]/68">{copy.ritualBody}</p>
            <div className="mt-8 grid gap-4">
              {copy.ritualSteps.map((step, index) => (
                <div className="flex items-center gap-4" key={step}>
                  <span className="grid size-10 shrink-0 place-items-center border border-[#B8935A]/35 font-mono text-xs text-[#B8935A]">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#F5EFE3]/82">{step}</p>
                </div>
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
        <div aria-hidden="true" className="mt-7 text-lg text-[#7b622d]">
          ◆
        </div>
        <div className="mt-12 grid gap-14">
          {moments.map((moment, index) => (
            <FadeUp key={moment.title}>
              <article className="grid gap-7 border-t border-[#7b622d]/18 pt-7 md:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.5fr)] md:items-end">
                <ImagePanel
                  alt={moment.title}
                  className="relative min-h-[27rem] overflow-hidden bg-[#0B0B0B]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src={moment.image}
                />
                <div className={index % 2 === 1 ? "md:pb-16" : ""}>
                  <p className="font-mono text-xs text-[#5f4a22]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 max-w-md font-serif text-4xl leading-none sm:text-5xl">
                    {moment.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-[#0B0B0B]/64">{moment.text}</p>
                </div>
              </article>
            </FadeUp>
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
          <div aria-hidden="true" className="mt-7 text-lg text-[#B8935A]">
            ◆
          </div>
          <p className="mx-auto mt-7 max-w-2xl font-serif text-2xl leading-[1.45] text-[#F5EFE3]/76 sm:text-3xl">
            {copy.closingBody}
          </p>
          <a
            className="mt-10 inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-8 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            {copy.whatsapp}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </FadeUp>
      </Container>
    </section>
  );
}

export function StickyMobileCTA({ copy }: { copy: Copy }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [dismissedSection, setDismissedSection] = useState<string | null>(null);
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

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-[#B8935A]/18 bg-[#0B0B0B]/90 p-2 shadow-[0_18px_70px_rgb(0_0_0/.45)] backdrop-blur-xl md:hidden">
      <div className="px-2">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
          Maison Fondjo
        </p>
        <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#F5EFE3]/52">Buea</p>
      </div>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#B8935A] px-4 text-center text-xs font-semibold text-[#0B0B0B]"
        href="#contact"
      >
        {copy.contact}
      </a>
      <button
        aria-label="Masquer la barre de commande"
        className="grid size-10 place-items-center rounded-sm border border-white/10 text-[#F5EFE3]/72"
        onClick={() => setDismissedSection(activeSection)}
        type="button"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function LuxuryFooter({
  content,
  copy,
  locale,
  whatsappUrl,
}: PremiumStorefrontPageProps & { copy: Copy; whatsappUrl: string }) {
  return (
    <footer className="bg-[#0B0B0B] px-5 pb-28 pt-16 text-[#F5EFE3] md:pb-16">
      <Container className="grid gap-8 border-t border-[#B8935A]/16 pt-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-serif text-4xl text-[#B8935A]">MF</p>
          <p className="mt-2 text-sm font-semibold text-[#B8935A]/82">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#F5EFE3]/58">
            {t(content.brandPositioning.primary, locale)}
          </p>
          <p className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#F5EFE3]/42">
            © Maison Fondjo
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#B8935A]/28 px-5 text-sm font-semibold"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {copy.whatsapp}
          </a>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/12 px-5 text-sm font-semibold"
            href="/policies/terms"
          >
            {copy.footerTerms}
          </Link>
        </div>
      </Container>
    </footer>
  );
}

function PremiumHeader({ copy, whatsappUrl }: { copy: Copy; whatsappUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B0B0B]/70 text-[#F5EFE3] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <a aria-label="Maison Fondjo home" className="flex items-center gap-3" href="#hero">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full border border-[#B8935A]/35 bg-[#0f2415] font-serif text-xs text-[#B8935A]"
          >
            MF
          </span>
          <span className="hidden sm:block text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[#F5EFE3]/58">
            Buea
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/62 lg:flex">
          {copy.nav.map(([label, href]) => (
            <a className="transition-colors hover:text-[#B8935A]" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            className="hidden h-10 items-center rounded-sm bg-[#B8935A] px-4 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98] lg:inline-flex"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            {copy.buy}
          </a>
          <Button
            aria-expanded={isOpen}
            aria-label={isOpen ? copy.navigationClose : copy.navigationOpen}
            className="border-white/12 bg-white/8 text-[#F5EFE3] lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            size="icon"
            variant="secondary"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </Container>
      {isOpen ? (
        <div className="absolute inset-x-3 top-24 z-50 border border-[#B8935A]/18 bg-[#0B0B0B]/96 p-3 shadow-[0_24px_80px_rgb(0_0_0/.5)] backdrop-blur-xl lg:hidden">
          <nav className="grid gap-1">
            {copy.nav.map(([label, href]) => (
              <a
                className="min-h-12 px-3 py-3 text-sm font-semibold text-[#F5EFE3]/78"
                href={href}
                key={href}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PremiumStorefrontPage({ content }: PremiumStorefrontPageProps) {
  const { copy: localizedCopy, locale } = useI18n();
  const [showNarrative, setShowNarrative] = useState(false);
  const copy = localizedCopy.home;
  const contentLocale: Locale = locale;
  const whatsappUrl = getWhatsAppUrl(content, contentLocale);

  useEffect(() => {
    if (showNarrative) {
      return;
    }

    const reveal = () => {
      window.clearTimeout(timer);
      setShowNarrative(true);
    };

    const timer = window.setTimeout(reveal, 9000);
    window.addEventListener("scroll", reveal, { once: true, passive: true });
    window.addEventListener("pointerdown", reveal, { once: true, passive: true });
    window.addEventListener("keydown", reveal, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [showNarrative]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#0B0B0B]">
      <PremiumHeader copy={copy} whatsappUrl={whatsappUrl} />
      <CinematicHero />
      <ProductShowcase copy={copy} whatsappUrl={whatsappUrl} />
      {showNarrative ? (
        <>
          <OriginSection copy={copy} />
          <FounderStorySection content={content} locale={contentLocale} />
          <IngredientCarousel content={content} copy={copy} locale={contentLocale} />
          <RitualSection copy={copy} />
          <LifestyleGallery copy={copy} />
          <ClosingChapter copy={copy} whatsappUrl={whatsappUrl} />
          <LuxuryFooter
            content={content}
            copy={copy}
            locale={contentLocale}
            whatsappUrl={whatsappUrl}
          />
        </>
      ) : (
        <div aria-hidden="true" className="h-px bg-[#0B0B0B]" />
      )}
    </main>
  );
}
