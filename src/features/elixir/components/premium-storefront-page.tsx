"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Globe2,
  Menu,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Store,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckoutTrustBar } from "@/features/elixir/components/CheckoutTrustBar";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getWhatsAppUrl } from "@/features/elixir/lib/cms";
import {
  dictionaries,
  isSiteLanguage,
  languageLabels,
  type SiteDictionary,
  type SiteLanguage,
} from "@/i18n/dictionaries";
import { siteImages } from "@/lib/site-images";

type PremiumStorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

type Copy = SiteDictionary;

const HairConsultationAgent = dynamic(
  () =>
    import("./hair-consultation-agent").then((module) => ({
      default: module.HairConsultationAgent,
    })),
  {
    loading: () => (
      <div className="min-h-[24rem] rounded-md border border-[#d6b75b]/18 bg-white/[0.035]" />
    ),
    ssr: false,
  },
);

const OrderFlow = dynamic(
  () => import("./order-flow").then((module) => ({ default: module.OrderFlow })),
  {
    loading: () => <div className="min-h-[28rem] rounded-md bg-[#fff6e5]" />,
    ssr: false,
  },
);

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHBhdGggZD0nTTAgMTZMMTYgME0tNCAxMkwxMi00TTQgMjBMMjAgNCcgc3Ryb2tlPScjYzhhOTUxJyBzdHJva2Utb3BhY2l0eT0nLjE2Jy8+PC9zdmc+";

const campaignImages = {
  backLabel: siteImages.backLabel,
  barbershop: siteImages.barbershop,
  facebookCover: siteImages.facebookCover,
  frontLabel: siteImages.frontLabel,
  hero: siteImages.volcanicBottle,
  market: siteImages.marketLifestyle,
  night: siteImages.nightRoutine,
  origin: siteImages.heroOrigin,
  packing: siteImages.packingOrders,
  profileLogo: siteImages.profileLogo,
  reflection: siteImages.studioReflection,
} as const;

const ingredientTimelineDetails = [
  {
    image: campaignImages.frontLabel,
    region: "West Africa",
  },
  {
    image: campaignImages.reflection,
    region: "East Africa",
  },
  {
    image: campaignImages.hero,
    region: "Tropics",
  },
  {
    image: campaignImages.origin,
    region: "Sonoran Desert",
  },
  {
    image: campaignImages.market,
    region: "Central America",
  },
  {
    image: campaignImages.night,
    region: "Mediterranean",
  },
  {
    image: campaignImages.packing,
    region: "Morocco",
  },
  {
    image: campaignImages.backLabel,
    region: "African + Ayurvedic",
  },
  {
    image: campaignImages.barbershop,
    region: "Australia",
  },
  {
    image: campaignImages.facebookCover,
    region: "North Africa",
  },
  {
    image: campaignImages.reflection,
    region: "Botanical lab",
  },
] as const;

function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
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

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 size-3 shrink-0"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 14s4.5-4.28 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.72 4.5 8 4.5 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="6" r="1.55" fill="currentColor" />
    </svg>
  );
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function CinematicHero({ copy, whatsappUrl }: { copy: Copy; whatsappUrl: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();
  const useMotion = !prefersReducedMotion && !isMobile;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const landscapeScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.08, 1.16]);
  const landscapeOpacity = useTransform(scrollYProgress, [0, 0.55, 0.86], [1, 0.82, 0.24]);
  const landscapeY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const productOpacity = useTransform(scrollYProgress, [0.26, 0.58], [0, 1]);
  const productScale = useTransform(scrollYProgress, [0, 0.78, 1], [0.72, 1.03, 1.1]);
  const productY = useTransform(scrollYProgress, [0, 1], ["12%", "-8%"]);
  const toBottleOpacity = useTransform(scrollYProgress, [0.34, 0.42, 0.82], [0, 1, 1]);
  const toBottleY = useTransform(scrollYProgress, [0.36, 0.72], ["14%", "0%"]);
  const storyOpacity = useTransform(scrollYProgress, [0.12, 0.3, 0.72], [0, 1, 0.28]);
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.8], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.72, 0.8], [18, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.6, 0.74], [1, 1, 0]);
  const goldGlowScale = useTransform(scrollYProgress, [0.2, 0.86], [0.72, 1.18]);

  return (
    <section
      className="relative min-h-[100svh] bg-[#080706] text-[#f5f0e8] md:h-[125svh]"
      data-mobile-cta-section="hero"
      id="hero"
      ref={heroRef}
    >
      <div className="sticky top-0 h-[100svh] min-h-[40rem] overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-center"
          style={
            useMotion ? { opacity: landscapeOpacity, scale: landscapeScale, y: landscapeY } : {}
          }
        >
          <ImagePanel
            alt="FONDJO RACINE volcanic stone bottle hero image"
            className="absolute inset-0"
            priority
            sizes="100vw"
            src={campaignImages.hero}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgb(8_7_6/.78)_38%,rgb(8_7_6/.2)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_7_6/.2)_0%,transparent_40%,#080706_100%)]" />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={
            useMotion
              ? { opacity: productOpacity, scale: productScale, y: productY }
              : { opacity: 0 }
          }
        >
          <ImagePanel
            alt="FONDJO RACINE isolated bottle in reflective black studio"
            className="absolute inset-0"
            sizes="100vw"
            src={campaignImages.reflection}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgb(8_7_6/.68)_35%,rgb(8_7_6/.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,#080706_100%)]" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[45%] size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6b75b]/26 blur-3xl sm:size-[32rem] lg:left-[67%]"
          style={{ scale: goldGlowScale }}
        />

        <Container className="relative z-10 grid h-full content-center gap-8 pb-32 pt-28 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:pb-24">
          <div className="max-w-5xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#d6b75b]">
              {copy.heroEyebrow}
            </p>
            <div
              aria-label={`${copy.heroTitleFirst} ${copy.heroTitleSecond}`}
              className="mt-5 font-serif font-light leading-[0.82]"
            >
              <p className="max-w-[9ch] text-[3.35rem] text-[#f6f0e4] sm:text-8xl lg:text-[8.5rem]">
                {copy.heroTitleFirst}
              </p>
              <motion.p
                className="mt-1 max-w-[9ch] text-[3.35rem] text-[#d6b75b] sm:text-8xl lg:text-[8.5rem]"
                style={useMotion ? { opacity: toBottleOpacity, y: toBottleY } : {}}
              >
                {copy.heroTitleSecond}
              </motion.p>
            </div>
            <motion.p
              className="mt-7 max-w-xl text-base leading-8 text-[#f6f0e4]/74 sm:text-lg"
              style={useMotion ? { opacity: storyOpacity } : {}}
            >
              {copy.heroStory}
            </motion.p>
          </div>

          <motion.div
            className="relative mx-auto hidden aspect-[4/5] w-full max-w-[28rem] lg:block"
            style={useMotion ? { opacity: productOpacity, scale: productScale, y: productY } : {}}
          >
            <div className="absolute inset-[9%] border border-[#d6b75b]/26 shadow-[0_44px_140px_rgb(0_0_0/.62)]" />
            <motion.div
              className="absolute inset-[12%] overflow-hidden rounded-md"
              animate={{ y: [0, -10, 0], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                alt="FONDJO RACINE bottle floating as the hero transitions into product focus"
                blurDataURL={blurDataUrl}
                className="object-cover"
                fill
                placeholder="blur"
                sizes="36vw"
                src={campaignImages.hero}
              />
              <div className="absolute inset-y-0 left-[18%] w-[12%] bg-white/14 blur-xl" />
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          className="absolute inset-x-4 bottom-5 z-20 mx-auto max-w-5xl border border-[#d6b75b]/24 bg-[#080706]/82 p-3 backdrop-blur-xl sm:bottom-7 sm:p-4"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <div>
              <p className="font-serif text-2xl leading-none text-[#d6b75b] sm:text-3xl">
                FONDJO RACINE
              </p>
              <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#f6f0e4]/72">
                {copy.productSpecOne[1]} · {copy.productSpecTwo[1]}
              </p>
            </div>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d6b75b] px-5 text-sm font-semibold text-[#080706] shadow-[0_20px_70px_rgb(214_183_91/.28)] transition-transform hover:-translate-y-0.5"
              href="#product"
            >
              {copy.ctaDiscover}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#d6b75b]/45 bg-white/8 px-5 text-sm font-semibold text-[#f6f0e4] backdrop-blur-md transition-transform hover:-translate-y-0.5"
              href="#diagnosis"
            >
              {copy.ctaConsultation}
              <Bot className="size-4" aria-hidden="true" />
            </a>
          </div>
          <a
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/14 bg-black/20 px-5 text-sm font-semibold text-[#f6f0e4] backdrop-blur-md sm:hidden"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {copy.whatsapp}
          </a>
          <CheckoutTrustBar className="mt-3" compact whatsappUrl={whatsappUrl} />
        </motion.div>

        <motion.a
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#f6f0e4]/58 md:inline-flex"
          href="#origin"
          style={{ opacity: cueOpacity }}
        >
          {copy.scroll}
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="size-4" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </div>
    </section>
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
            alt="FONDJO RACINE reflective black studio product image"
            className="relative aspect-[4/5] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
            sizes="(min-width: 1024px) 34vw, 100vw"
            src={campaignImages.reflection}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <ImagePanel
              alt="FONDJO RACINE front bottle label"
              className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
              sizes="(min-width: 1024px) 18vw, 50vw"
              src={campaignImages.frontLabel}
            />
            <ImagePanel
              alt="FONDJO RACINE back bottle label"
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
            alt="FONDJO RACINE origin story near Mount Cameroon"
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
  const ingredients = content.ingredientScience.ingredients.slice(
    0,
    ingredientTimelineDetails.length,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const nodeRefs = useRef(new Map<number, HTMLButtonElement>());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeIngredient =
    ingredients.find((_, ingredientIndex) => ingredientIndex === activeIndex) ?? ingredients[0];
  const activeDetails =
    ingredientTimelineDetails.find((_, detailIndex) => detailIndex === activeIndex) ??
    ingredientTimelineDetails[0];

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const index = Number(mostVisible?.target.getAttribute("data-ingredient-index"));

        if (Number.isInteger(index)) {
          setActiveIndex(index);
        }
      },
      {
        root: isMobile ? scrollerRef.current : null,
        rootMargin: isMobile ? "0px -38% 0px -38%" : "-42% 0px -42% 0px",
        threshold: isMobile ? [0.42, 0.62, 0.82] : [0.2, 0.45, 0.7],
      },
    );

    nodeRefs.current.forEach((node) => {
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [ingredients.length]);

  return (
    <section
      className="bg-[#080706] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="formula"
      id="formula"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <FadeUp className="lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.formula}
          </p>
          <h2 className="mt-4 font-serif text-5xl font-light leading-[0.9] sm:text-6xl lg:text-7xl">
            {copy.formulaTitle}
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#f6f0e4]/65">{copy.formulaBody}</p>

          {activeIngredient ? (
            <motion.article
              className="mt-8 overflow-hidden rounded-md border border-[#d6b75b]/20 bg-white/[0.035] shadow-[0_30px_90px_rgb(0_0_0/.28)]"
              key={t(activeIngredient.name, locale)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[16/10] bg-[#17130e]">
                <Image
                  alt={`${t(activeIngredient.name, locale)} macro botanical texture`}
                  blurDataURL={blurDataUrl}
                  className="object-cover"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  src={activeDetails.image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(8_7_6/.74)_100%)]" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-[#d6b75b]/28 bg-[#080706]/72 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d6b75b] backdrop-blur">
                  <MapPinIcon />
                  {activeDetails.region}
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="font-mono text-xs text-[#d6b75b]">
                  {String(activeIndex + 1).padStart(2, "0")} / {ingredients.length}
                </p>
                <h3 className="mt-3 font-serif text-4xl text-[#f6f0e4]">
                  {t(activeIngredient.name, locale)}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/66">
                  {t(activeIngredient.note, locale)}
                </p>
              </div>
            </motion.article>
          ) : null}
        </FadeUp>

        <div
          aria-label="Ingredient timeline"
          className="relative -mx-5 snap-x snap-mandatory overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          ref={scrollerRef}
        >
          <div className="relative w-max min-w-full px-1 py-6 lg:w-auto lg:px-2 lg:py-8">
            <div className="absolute left-5 right-5 top-[2.55rem] h-px bg-[#d6b75b]/36 lg:left-8 lg:right-8 lg:top-[3.25rem]" />
            <div className="grid auto-cols-[8.5rem] grid-flow-col gap-3 lg:grid-flow-row lg:grid-cols-11 lg:auto-cols-auto">
              {ingredients.map((ingredient, index) => {
                const details =
                  ingredientTimelineDetails.find((_, detailIndex) => detailIndex === index) ??
                  ingredientTimelineDetails[0];
                const isActive = index === activeIndex;

                return (
                  <button
                    aria-expanded={isActive}
                    aria-label={`${t(ingredient.name, locale)}. ${details.region}`}
                    className="group relative grid min-h-[8.75rem] snap-center content-start gap-3 rounded-md px-1 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6b75b] lg:min-h-[12rem] lg:rounded-none lg:px-0 lg:py-0"
                    data-ingredient-index={index}
                    key={t(ingredient.name, locale)}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    ref={(node) => {
                      if (node) {
                        nodeRefs.current.set(index, node);
                      } else {
                        nodeRefs.current.delete(index);
                      }
                    }}
                    type="button"
                  >
                    <span
                      className={`relative z-10 grid size-9 place-items-center rounded-full border transition-all duration-300 lg:size-8 ${
                        isActive
                          ? "border-[#d6b75b] bg-[#d6b75b] text-[#080706] shadow-[0_0_32px_rgb(214_183_91/.38)]"
                          : "border-[#d6b75b]/45 bg-[#080706] text-[#d6b75b] group-hover:border-[#d6b75b]"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-current" />
                    </span>
                    <span className="block min-h-11 pr-2 font-serif text-base leading-tight text-[#f6f0e4] lg:min-h-16 lg:text-xl lg:leading-none">
                      {t(ingredient.name, locale)}
                    </span>
                    <span className="flex items-start gap-1.5 pr-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#d6b75b]/74 lg:gap-2 lg:text-[0.62rem] lg:tracking-[0.18em]">
                      <MapPinIcon />
                      {details.region}
                    </span>
                    <motion.span
                      className="pointer-events-none absolute left-0 right-0 top-[7.2rem] hidden rounded-md border border-[#d6b75b]/18 bg-[#15110c]/92 p-3 text-xs leading-5 text-[#f6f0e4]/68 shadow-[0_24px_70px_rgb(0_0_0/.34)] backdrop-blur lg:block"
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {t(ingredient.note, locale)}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function RitualSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-[#100d0a] text-[#f6f0e4]" data-mobile-cta-section="ritual" id="ritual">
      <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
        <ImagePanel
          alt="FONDJO RACINE night self-care ritual"
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
      src: campaignImages.night,
      text: copy.nightText,
      title: copy.nightTitle,
    },
    {
      src: campaignImages.market,
      text: copy.marketText,
      title: copy.marketTitle,
    },
    {
      src: campaignImages.barbershop,
      text: copy.barbershopText,
      title: copy.barbershopTitle,
    },
    {
      src: campaignImages.packing,
      text: copy.packingText,
      title: copy.packingTitle,
    },
  ] as const;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMoment = moments.find((_, index) => index === activeIndex) ?? moments[0];

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
        <FadeUp className="mt-12 grid gap-5 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
          <motion.div
            className="relative min-h-[28rem] overflow-hidden rounded-md bg-[#14110b]"
            key={activeMoment.title}
            initial={{ opacity: 0.82 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImagePanel
              alt={`FONDJO RACINE ${activeMoment.title}`}
              className="absolute inset-0"
              sizes="(min-width: 1024px) 58vw, 100vw"
              src={activeMoment.src}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(20_17_11/.82)_100%)]" />
            <div className="absolute bottom-6 left-5 right-5 text-[#f6f0e4] sm:bottom-8 sm:left-8 sm:right-8">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d6b75b]">
                {copy.gallery}
              </p>
              <h3 className="mt-3 font-serif text-5xl font-light leading-none">
                {activeMoment.title}
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#f6f0e4]/72">
                {activeMoment.text}
              </p>
            </div>
          </motion.div>
          <div className="grid gap-3">
            {moments.map((moment, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-pressed={isActive}
                  className={`group grid grid-cols-[5.5rem_1fr] gap-4 rounded-md border p-2 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7b622d] ${
                    isActive
                      ? "border-[#7b622d]/40 bg-[#14110b] text-[#f6f0e4]"
                      : "border-[#7b622d]/16 bg-white/30 text-[#14110b] hover:border-[#7b622d]/34"
                  }`}
                  key={moment.title}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  type="button"
                >
                  <ImagePanel
                    alt=""
                    className="relative aspect-square overflow-hidden rounded-sm bg-[#17130e]"
                    sizes="6rem"
                    src={moment.src}
                  />
                  <span className="flex min-w-0 flex-col justify-center">
                    <span className="font-serif text-2xl leading-none">{moment.title}</span>
                    <span
                      className={`mt-2 text-xs leading-5 ${
                        isActive ? "text-[#f6f0e4]/62" : "text-[#14110b]/62"
                      }`}
                    >
                      {moment.text}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </FadeUp>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {moments.map((moment, index) => (
            <FadeUp className={index % 2 === 1 ? "md:mt-10" : ""} key={moment.title}>
              <article className="group">
                <ImagePanel
                  alt={`FONDJO RACINE ${moment.title}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-md"
                  sizes="(min-width: 768px) 25vw, 100vw"
                  src={moment.src}
                />
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

export function DeliveryShippingSection({
  copy,
  whatsappUrl,
}: {
  copy: Copy;
  whatsappUrl: string;
}) {
  const icons = [Truck, Globe2, MessageCircle, Store] as const;

  return (
    <section
      className="bg-[#0d0b08] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="delivery"
      id="delivery"
    >
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.delivery.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.86]">
            {copy.delivery.title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/68">{copy.delivery.body}</p>
          <a
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d6b75b] px-5 text-sm font-semibold text-[#080706]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {copy.whatsapp}
          </a>
        </FadeUp>
        <div className="grid gap-3 sm:grid-cols-2">
          {copy.delivery.cards.map(([title, body], index) => {
            const Icon = icons[index] ?? PackageCheck;

            return (
              <FadeUp key={title}>
                <article className="min-h-48 rounded-md border border-[#d6b75b]/16 bg-white/[0.035] p-5">
                  <Icon className="size-6 text-[#d6b75b]" aria-hidden="true" />
                  <h3 className="mt-5 font-serif text-3xl leading-none">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/62">{body}</p>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function BatchCountdown({ copy }: { copy: Copy }) {
  const target = new Date("2026-07-06T09:00:00+01:00").getTime();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const clamped = Math.max(0, remaining);
  const days = Math.floor(clamped / 86_400_000);
  const hours = Math.floor((clamped % 86_400_000) / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);

  return (
    <section
      className="bg-[#080706] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="batch"
      id="batch"
    >
      <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            FONDJO RACINE
          </p>
          <h2 className="mt-4 font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.82]">
            30 bottles. No silent restock.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/68">{copy.productText}</p>
        </FadeUp>
        <FadeUp className="border border-[#d6b75b]/18 bg-white/[0.035] p-5 sm:p-8">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["Days", days],
              ["Hours", hours],
              ["Minutes", minutes],
            ].map(([label, value]) => (
              <div className="border border-[#d6b75b]/14 bg-[#080706]/60 p-4" key={label}>
                <p className="font-mono text-3xl text-[#d6b75b] sm:text-5xl">{value}</p>
                <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#f6f0e4]/58">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#f6f0e4]/58">
              <span>Reserved</span>
              <span>30 total</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-[linear-gradient(90deg,#8c7435,#f0d860,#8c7435)]"
                initial={{ width: "8%" }}
                whileInView={{ width: "43%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function AIConsultationPreview({
  copy,
  locale,
}: PremiumStorefrontPageProps & { copy: Copy }) {
  return (
    <section
      className="bg-[#100d0a] py-20 text-[#f6f0e4] sm:py-28"
      data-mobile-cta-section="diagnosis"
      id="diagnosis"
    >
      <Container>
        <FadeUp className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.diagnosis}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.9]">
            {copy.aiTitle}
          </h2>
        </FadeUp>
        <FadeUp>
          <HairConsultationAgent locale={locale} />
        </FadeUp>
      </Container>
    </section>
  );
}

export function PreorderCheckout({
  content,
  copy,
  locale,
}: PremiumStorefrontPageProps & { copy: Copy }) {
  return (
    <section
      className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28"
      data-mobile-cta-section="checkout"
      id="checkout"
    >
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            {copy.contact}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.86]">
            Contact FONDJO RACINE.
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#14110b]/68">
            Contact the team directly for product guidance, delivery timelines, and payment support.
          </p>
        </FadeUp>
        <div className="mt-10 rounded-md border border-[#7b622d]/18 bg-[#fffaf0] p-3 shadow-[0_22px_90px_rgb(20_17_11/.12)] sm:p-5">
          <OrderFlow content={content} locale={locale} />
        </div>
        <CheckoutTrustBar
          className="mt-5 border-[#7b622d]/16 bg-[#14110b] shadow-[0_18px_70px_rgb(20_17_11/.14)]"
          whatsappUrl={getWhatsAppUrl(content, locale)}
        />
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
          FONDJO
        </p>
        <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#f6f0e4]/52">
          RACINE
        </p>
      </div>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d6b75b] px-4 text-center text-xs font-semibold text-[#080706]"
        href="#contact"
      >
        {copy.contact}
      </a>
      <button
        aria-label="Dismiss order bar"
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
          <p className="font-serif text-4xl text-[#d6b75b]">FONDJO RACINE</p>
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
            Policies
          </Link>
        </div>
      </Container>
    </footer>
  );
}

function LanguageSwitcher({
  language,
  setLanguage,
}: {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
}) {
  const languages: SiteLanguage[] = ["en", "fr", "es"];

  return (
    <div className="inline-flex items-center rounded-md border border-white/12 bg-white/5 p-1">
      {languages.map((item) => (
        <button
          aria-pressed={language === item}
          className={`min-h-8 rounded px-2 text-xs font-semibold transition-colors ${
            language === item ? "bg-[#d6b75b] text-[#080706]" : "text-[#f6f0e4]/68"
          }`}
          key={item}
          onClick={() => setLanguage(item)}
          type="button"
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}

function PremiumHeader({
  copy,
  language,
  setLanguage,
}: {
  copy: Copy;
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080706]/70 text-[#f6f0e4] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <a className="flex items-center gap-3" href="#hero">
          <span className="relative size-9 overflow-hidden rounded-full border border-[#d6b75b]/35">
            <Image
              alt="FONDJO RACINE profile logo"
              blurDataURL={blurDataUrl}
              className="object-cover"
              fill
              loading="lazy"
              placeholder="blur"
              sizes="36px"
              src={campaignImages.profileLogo}
            />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none text-[#d6b75b]">FONDJO</span>
            <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.4em] text-[#f6f0e4]/58">
              Racine
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
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <a
            className="inline-flex h-10 items-center rounded-md bg-[#d6b75b] px-4 text-sm font-semibold text-[#080706]"
            href="#delivery"
          >
            {copy.ctaShipping}
          </a>
        </div>

        <Button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
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
            <div className="px-3 py-3">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PremiumStorefrontPage({ content, locale }: PremiumStorefrontPageProps) {
  const [language, setLanguageState] = useState<SiteLanguage>(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = window.localStorage.getItem("fondjo-language");

      if (isSiteLanguage(storedLanguage)) {
        return storedLanguage;
      }
    }

    return locale === "fr" ? "fr" : "en";
  });
  const copy = dictionaries[language];
  const contentLocale: Locale = language === "fr" ? "fr" : "en";
  const whatsappUrl = getWhatsAppUrl(content, contentLocale);

  function setLanguage(nextLanguage: SiteLanguage) {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("fondjo-language", nextLanguage);
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#080706]">
      <PremiumHeader copy={copy} language={language} setLanguage={setLanguage} />
      <CinematicHero copy={copy} whatsappUrl={whatsappUrl} />
      <ProductShowcase copy={copy} />
      <OriginSection copy={copy} />
      <FounderStorySection content={content} locale={contentLocale} />
      <IngredientCarousel content={content} copy={copy} locale={contentLocale} />
      <RitualSection copy={copy} />
      <LifestyleGallery copy={copy} />
      <DeliveryShippingSection copy={copy} whatsappUrl={whatsappUrl} />
      <AIConsultationPreview content={content} copy={copy} locale={contentLocale} />
      <section
        className="relative min-h-[28rem] overflow-hidden bg-[#080706]"
        data-mobile-cta-section="contact"
        id="contact"
      >
        <ImagePanel
          alt="FONDJO RACINE Facebook campaign cover"
          className="absolute inset-0 opacity-78"
          sizes="100vw"
          src={campaignImages.facebookCover}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgb(8_7_6/.54),#080706_100%)]" />
        <Container className="relative flex min-h-[28rem] items-center justify-center text-center text-[#f6f0e4]">
          <FadeUp>
            <Sparkles className="mx-auto size-6 text-[#d6b75b]" aria-hidden="true" />
            <p className="mt-5 font-serif text-[clamp(2.5rem,8vw,7rem)] font-light leading-none">
              {copy.coverTitle}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.32em] text-[#f6f0e4]/58">
              {copy.coverSubtitle}
            </p>
          </FadeUp>
        </Container>
      </section>
      <LuxuryFooter
        content={content}
        copy={copy}
        locale={contentLocale}
        whatsappUrl={whatsappUrl}
      />
    </main>
  );
}
