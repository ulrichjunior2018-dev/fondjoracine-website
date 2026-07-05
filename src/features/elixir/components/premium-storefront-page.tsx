"use client";

import { motion } from "framer-motion";
import { Menu, MessageCircle, Sparkles, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CinematicHero } from "@/components/CinematicHero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { formulaIngredients, formulaNote, getFormulaIngredientCopy } from "@/content/formula";
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
  facebookCover: siteImages.facebookCover,
  frontLabel: siteImages.frontLabel,
  hero: siteImages.hero,
  hairTexture: siteImages.hairTextureLifestyle,
  market: siteImages.marketLifestyle,
  night: siteImages.nightRoutine,
  origin: siteImages.originMountCameroon,
  packing: siteImages.packingOrders,
  profileLogo: siteImages.profileLogo,
  reflection: siteImages.studioBottle,
  ingredientAvocadoOil: siteImages.ingredientAvocadoOil,
  ingredientCastorOil: siteImages.ingredientCastorOil,
  ingredientCoconutOil: siteImages.ingredientCoconutOil,
  ingredientJojobaOil: siteImages.ingredientJojobaOil,
  ingredientOliveOil: siteImages.ingredientOliveOil,
} as const;

function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-12%" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
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

export function ProductShowcase({ copy }: { copy: Copy }) {
  return (
    <section
      className="border-y border-[#d6b75b]/14 bg-[#0d0b08] py-16"
      data-mobile-cta-section="product"
      id="product"
    >
      <Container className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <FadeUp className="grid gap-3 sm:grid-cols-[1fr_0.72fr] sm:gap-4">
          <ImagePanel
            alt={copy.mediaAlts.product}
            className="relative aspect-[4/5] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
            sizes="(min-width: 1024px) 34vw, 100vw"
            src={campaignImages.reflection}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <ImagePanel
              alt={copy.mediaAlts.frontLabel}
              className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
              sizes="(min-width: 1024px) 18vw, 50vw"
              src={campaignImages.frontLabel}
            />
            <ImagePanel
              alt={copy.mediaAlts.backLabel}
              className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
              sizes="(min-width: 1024px) 18vw, 50vw"
              src={campaignImages.backLabel}
            />
          </div>
        </FadeUp>
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#d6b75b]">
            {copy.productEyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6.6rem)] font-light leading-[0.86] text-[#f6f0e4]">
            {copy.productTitle}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/68">{copy.productText}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[copy.productSpecOne, copy.productSpecTwo, copy.productSpecThree].map(
              ([label, value]) => (
                <div className="border border-[#d6b75b]/16 bg-white/[0.03] p-4" key={label}>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d6b75b]">
                    {label}
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#f6f0e4]">{value}</p>
                </div>
              ),
            )}
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function OriginSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28"
      data-mobile-cta-section="origin"
      id="origin"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            {copy.originEyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.originTitle}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#14110b]/70">{copy.originBody}</p>
        </FadeUp>
        <FadeUp className="relative min-h-[34rem] overflow-hidden rounded-md">
          <ImagePanel
            alt={copy.mediaAlts.origin}
            className="absolute inset-0"
            sizes="(min-width: 1024px) 52vw, 100vw"
            src={campaignImages.origin}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgb(0_0_0/.45))]" />
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
      className="relative min-h-[92svh] overflow-hidden bg-[#080706] text-[#f6f0e4]"
      data-mobile-cta-section="founder"
      id="founder"
      ref={sectionRef}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
      >
        <Image
          alt=""
          blurDataURL={blurDataUrl}
          className="object-cover"
          fill
          placeholder="blur"
          sizes="100vw"
          src={campaignImages.origin}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(8_7_6/.88)_0%,rgb(8_7_6/.66)_48%,rgb(8_7_6/.2)_100%),linear-gradient(180deg,rgb(8_7_6/.18)_0%,rgb(8_7_6/.72)_100%)]" />

      <Container className="relative flex min-h-[92svh] items-center py-24 sm:py-32">
        <div
          className={`max-w-4xl transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {t(content.founder.eyebrow, locale)}
          </p>
          <h2 className="mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.08] text-[#f6f0e4] sm:text-7xl lg:text-8xl">
            {t(content.founder.title, locale)}
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-2xl leading-[1.55] text-[#f6f0e4]/82 sm:text-3xl">
            {t(content.founder.signature, locale)}
          </p>
          <p className="mt-8 max-w-2xl text-sm leading-8 text-[#f6f0e4]/68 sm:text-base">
            {t(founderIntro, locale)}
          </p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-[#d6b75b]/82">
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
      className="overflow-hidden bg-[#080706] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="formula"
      id="formula"
    >
      <Container>
        <FadeUp className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.formula}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-5xl font-light leading-[0.9] sm:text-6xl lg:text-7xl">
            {copy.formulaTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#f6f0e4]/65">{copy.formulaBody}</p>
        </FadeUp>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient, index) => {
            const ingredientCopy = getFormulaIngredientCopy(ingredient, locale);

            return (
              <motion.article
                className="group relative min-h-[24rem] overflow-hidden rounded-sm border border-[#d6b75b]/46 bg-[#f6f0e4] p-6 text-[#14110b] shadow-[0_24px_80px_rgb(0_0_0/.2)]"
                initial={{ opacity: 0, y: 18 }}
                key={`${ingredientCopy.name}-${index}`}
                transition={{ duration: 0.45, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-12%" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div aria-hidden="true" className="absolute inset-3 border border-[#d6b75b]/30" />
                <div className="relative">
                  <p className="text-center text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#7b622d]/80">
                    Maison Fondjo Herbier
                  </p>
                  <EngravedBotanicalIllustration index={index} />
                  <h3 className="mt-5 text-center font-serif text-4xl font-light leading-none">
                    {ingredientCopy.name}
                  </h3>
                  <p className="mt-2 text-center font-serif text-lg italic text-[#7b622d]">
                    {ingredient.latin}
                  </p>
                  <div className="mx-auto mt-5 h-px w-24 bg-[#d6b75b]" />
                  <p className="mt-6 text-center text-sm leading-7 text-[#14110b]/70">
                    {ingredientCopy.chosenFor}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-6 text-[#f6f0e4]/45">{formulaNoteText}</p>
      </Container>
    </section>
  );
}

export function WhyItWorksSection({ copy }: { copy: Copy }) {
  return (
    <section
      className="relative overflow-hidden bg-[#0d0b08] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="mechanism"
      id="why-it-works"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgb(214_183_91/.12),transparent_28%),linear-gradient(180deg,#0d0b08,#080706)]"
      />
      <Container className="relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.whyEyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.7rem,7vw,6.4rem)] font-light leading-[0.88]">
            {copy.whyTitle}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/66">{copy.whyBody}</p>
        </FadeUp>

        <FadeUp className="relative">
          <div className="relative overflow-hidden rounded-md border border-[#d6b75b]/18 bg-white/[0.035] p-5 sm:p-8">
            <div className="absolute inset-x-8 top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,#d6b75b,transparent)] lg:block" />
            <div className="grid gap-4 lg:grid-cols-4">
              {copy.whySteps.map(([title, body], index) => (
                <article
                  className="group relative rounded-md border border-[#d6b75b]/14 bg-[#080706]/72 p-5 transition-transform duration-300 hover:-translate-y-1"
                  key={title}
                >
                  <span className="relative z-10 grid size-12 place-items-center rounded-full border border-[#d6b75b]/36 bg-[#0d0b08] font-mono text-xs text-[#d6b75b] shadow-[0_0_34px_rgb(214_183_91/.12)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 font-serif text-3xl leading-none text-[#f6f0e4]">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/62">{body}</p>
                  <div
                    aria-hidden="true"
                    className="mt-6 h-px bg-[linear-gradient(90deg,#d6b75b,transparent)] opacity-45"
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
    <section className="bg-[#100d0a] text-[#f6f0e4]" data-mobile-cta-section="ritual" id="ritual">
      <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
        <ImagePanel
          alt={copy.mediaAlts.nightRoutine}
          className="relative min-h-[34rem] overflow-hidden"
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={campaignImages.night}
        />
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-16">
          <FadeUp className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
              {copy.ritual}
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6rem)] font-light leading-[0.86]">
              {copy.ritualTitle}
            </h2>
            <p className="mt-6 text-sm leading-8 text-[#f6f0e4]/68">{copy.ritualBody}</p>
            <div className="mt-8 grid gap-4">
              {copy.ritualSteps.map((step, index) => (
                <div className="flex items-center gap-4" key={step}>
                  <span className="grid size-10 shrink-0 place-items-center border border-[#d6b75b]/35 font-mono text-xs text-[#d6b75b]">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#f6f0e4]/82">{step}</p>
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
      text: copy.nightText,
      title: copy.nightTitle,
    },
    {
      text: copy.marketText,
      title: copy.marketTitle,
    },
    {
      text: copy.barbershopText,
      title: copy.barbershopTitle,
    },
    {
      text: copy.packingText,
      title: copy.packingTitle,
    },
  ] as const;

  return (
    <section
      className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28"
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
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {moments.map((moment, index) => (
            <FadeUp className={index % 2 === 1 ? "md:mt-10" : ""} key={moment.title}>
              <article className="group rounded-sm border border-[#7b622d]/18 bg-white/42 p-3">
                <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-sm border border-[#7b622d]/22 bg-[#14110b] text-[#f6f0e4]">
                  <div aria-hidden="true" className="absolute inset-5 border border-[#d6b75b]/24" />
                  <div className="relative px-5 text-center">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#d6b75b]">
                      {copy.textureTitle}
                    </p>
                    <p className="mt-4 font-serif text-3xl leading-none">{moment.title}</p>
                    <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[#f6f0e4]/48">
                      {copy.textureText}
                    </p>
                  </div>
                </div>
                <h3 className="mt-4 font-serif text-3xl">{moment.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#14110b]/64">{moment.text}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ClosingChapter({ copy, whatsappUrl }: { copy: Copy; whatsappUrl: string }) {
  const [consultationCard, shippingCard, supportCard] = copy.closingCards;
  const actions = [
    {
      body: consultationCard?.[1] ?? "",
      href: "/diagnostic",
      icon: Sparkles,
      title: consultationCard?.[0] ?? "",
    },
    {
      body: shippingCard?.[1] ?? "",
      href: "/policies/shipping",
      icon: Truck,
      title: shippingCard?.[0] ?? "",
    },
    {
      body: supportCard?.[1] ?? "",
      href: whatsappUrl,
      icon: MessageCircle,
      title: supportCard?.[0] ?? "",
    },
  ] as const;

  return (
    <section
      className="relative overflow-hidden bg-[#080706] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="contact"
      id="contact"
    >
      <ImagePanel
        alt={copy.mediaAlts.banner}
        className="absolute inset-0 opacity-42"
        sizes="100vw"
        src={campaignImages.facebookCover}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgb(8_7_6/.74)_48%,#080706_100%),linear-gradient(180deg,rgb(8_7_6/.1),#080706_100%)]" />
      <Container className="relative">
        <FadeUp className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.closingEyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.closingTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#f6f0e4]/68">{copy.closingBody}</p>
        </FadeUp>
        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {actions.map(({ body, href, icon: Icon, title }) => {
            const external = href.startsWith("http");

            return (
              <a
                className="group min-h-48 rounded-md border border-[#d6b75b]/16 bg-[#080706]/72 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                href={href}
                key={title}
                rel={external ? "noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                <Icon className="size-6 text-[#d6b75b]" aria-hidden="true" />
                <h3 className="mt-6 font-serif text-3xl leading-none">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/62">{body}</p>
                <span className="mt-6 block h-px bg-[linear-gradient(90deg,#d6b75b,transparent)] opacity-45 transition-opacity group-hover:opacity-90" />
              </a>
            );
          })}
        </div>
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
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border border-[#d6b75b]/18 bg-[#080706]/90 p-2 shadow-[0_18px_70px_rgb(0_0_0/.45)] backdrop-blur-xl md:hidden">
      <div className="px-2">
        <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#d6b75b]">
          Maison Fondjo
        </p>
        <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#f6f0e4]/52">Buea</p>
      </div>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d6b75b] px-4 text-center text-xs font-semibold text-[#080706]"
        href="#contact"
      >
        {copy.contact}
      </a>
      <button
        aria-label="Masquer la barre de commande"
        className="grid size-10 place-items-center rounded-sm border border-white/10 text-[#f6f0e4]/72"
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
    <footer className="bg-[#080706] px-5 pb-28 pt-16 text-[#f6f0e4] md:pb-16">
      <Container className="grid gap-8 border-t border-[#d6b75b]/16 pt-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-serif text-4xl text-[#d6b75b]">Maison Fondjo</p>
          <p className="mt-2 text-sm font-semibold text-[#d6b75b]/82">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#f6f0e4]/58">
            {t(content.brandPositioning.primary, locale)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#d6b75b]/28 px-5 text-sm font-semibold"
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

function PremiumHeader({ copy }: { copy: Copy }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080706]/70 text-[#f6f0e4] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <a className="flex items-center gap-3" href="#hero">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full border border-[#d6b75b]/35 bg-[#0f2415] font-serif text-xs text-[#d6b75b]"
          >
            MF
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none text-[#d6b75b]">
              Maison Fondjo
            </span>
            <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[#f6f0e4]/58">
              Buea
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/62 lg:flex">
          {copy.nav.map(([label, href]) => (
            <a className="transition-colors hover:text-[#d6b75b]" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            className="inline-flex h-10 items-center rounded-md bg-[#d6b75b] px-4 text-sm font-semibold text-[#080706]"
            href="#contact"
          >
            {copy.contact}
          </a>
        </div>

        <Button
          aria-expanded={isOpen}
          aria-label={isOpen ? copy.navigationClose : copy.navigationOpen}
          className="border-white/12 bg-white/8 text-[#f6f0e4] lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          size="icon"
          variant="secondary"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </Container>
      {isOpen ? (
        <div className="absolute inset-x-3 top-24 z-50 border border-[#d6b75b]/18 bg-[#080706]/96 p-3 shadow-[0_24px_80px_rgb(0_0_0/.5)] backdrop-blur-xl lg:hidden">
          <nav className="grid gap-1">
            {copy.nav.map(([label, href]) => (
              <a
                className="min-h-12 px-3 py-3 text-sm font-semibold text-[#f6f0e4]/78"
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
  const copy = localizedCopy.home;
  const contentLocale: Locale = locale;
  const whatsappUrl = getWhatsAppUrl(content, contentLocale);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#080706]">
      <PremiumHeader copy={copy} />
      <CinematicHero />
      <ProductShowcase copy={copy} />
      <OriginSection copy={copy} />
      <FounderStorySection content={content} locale={contentLocale} />
      <IngredientCarousel content={content} copy={copy} locale={contentLocale} />
      <WhyItWorksSection copy={copy} />
      <RitualSection copy={copy} />
      <LifestyleGallery copy={copy} />
      <ClosingChapter copy={copy} whatsappUrl={whatsappUrl} />
      <LuxuryFooter
        content={content}
        copy={copy}
        locale={contentLocale}
        whatsappUrl={whatsappUrl}
      />
    </main>
  );
}
