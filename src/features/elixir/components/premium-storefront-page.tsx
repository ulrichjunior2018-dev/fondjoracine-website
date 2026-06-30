"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronDown,
  Globe2,
  Leaf,
  Menu,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getWhatsAppUrl } from "@/features/elixir/lib/cms";

import { HairConsultationAgent } from "./hair-consultation-agent";
import { OrderFlow } from "./order-flow";

type PremiumStorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

type Copy = ReturnType<typeof getCopy>;

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHBhdGggZD0nTTAgMTZMMTYgME0tNCAxMkwxMi00TTQgMjBMMjAgNCcgc3Ryb2tlPScjYzhhOTUxJyBzdHJva2Utb3BhY2l0eT0nLjE2Jy8+PC9zdmc+";

const campaignImages = {
  barbershop: "/images/barbershop-grooming.jpg",
  facebookCover: "/images/facebook-cover.jpg",
  frontLabel: "/images/front-label.jpg",
  hero: "/images/hero-volcanic-bottle.jpg",
  market: "/images/buea-market-lifestyle.jpg",
  night: "/images/night-routine.jpg",
  origin: "/images/mount-cameroon-origin.jpg",
  packing: "/images/packing-orders.jpg",
  profileLogo: "/images/profile-logo.jpg",
  reflection: "/images/studio-reflection-bottle.jpg",
  backLabel: "/images/back-label.jpg",
} as const;

const sectionMotion = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function getCopy(locale: Locale) {
  return {
    aiTitle:
      locale === "fr"
        ? "Diagnostic capillaire avant le flacon."
        : "A hair diagnosis before the bottle.",
    batch: locale === "fr" ? "Lot #001" : "Batch #001",
    checkout: locale === "fr" ? "Precommander maintenant" : "Pre-order now",
    diagnosis: locale === "fr" ? "Diagnostic cheveux" : "Start Hair Diagnosis",
    formula: locale === "fr" ? "Formule" : "Formula",
    ingredients:
      locale === "fr"
        ? "Huiles botaniques choisies pour nourrir, assouplir et proteger la fibre sans promesse medicale."
        : "Botanical oils chosen to nourish, soften, and protect the hair fiber without medical claims.",
    language: locale === "fr" ? "English" : "Francais",
    lifestyle: locale === "fr" ? "Vie quotidienne" : "Lifestyle",
    menu: locale === "fr" ? "Menu" : "Menu",
    nav: [
      { href: "#origin", label: locale === "fr" ? "Origine" : "Origin" },
      { href: "#formula", label: locale === "fr" ? "Formule" : "Formula" },
      { href: "#ritual", label: locale === "fr" ? "Rituel" : "Ritual" },
      { href: "#batch", label: locale === "fr" ? "Lot #001" : "Batch #001" },
      { href: "#checkout", label: locale === "fr" ? "Commander" : "Checkout" },
    ],
    origin:
      locale === "fr"
        ? "Ne a Buea, pres du Mont Cameroun, FONDJO RACINE transforme une routine capillaire en rituel de soin ancre, moderne et precis."
        : "Born in Buea near Mount Cameroon, FONDJO RACINE turns hair care into a rooted, modern, precise ritual.",
    preorder: locale === "fr" ? "Precommander Lot #001" : "Pre-order Batch #001",
    price: "8,500 XAF",
    originalPrice: "9,500 XAF",
    ritual:
      locale === "fr"
        ? "Appliquez quelques gouttes le soir, massez le cuir chevelu, puis laissez la lumiere revenir lentement dans les longueurs."
        : "Apply a few drops at night, massage the scalp, then let softness and light return slowly through the lengths.",
    scarcity:
      locale === "fr"
        ? "Seulement 30 flacons pour le premier lot. Expedition le 6 juillet 2026."
        : "Only 30 bottles in the first batch. Ships July 6, 2026.",
    scroll: locale === "fr" ? "Defiler" : "Scroll",
    ships: locale === "fr" ? "Expedition 6 juillet 2026" : "Ships July 6, 2026",
    story: locale === "fr" ? "Histoire du produit" : "Product story",
    title: "FROM THE SOIL TO THE BOTTLE",
    whatsapp: locale === "fr" ? "Commander sur WhatsApp" : "Order on WhatsApp",
  };
}

function FadeUp({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={sectionMotion}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="show"
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
    <div className={className}>
      <Image
        alt={alt}
        blurDataURL={blurDataUrl}
        className="object-cover"
        fill
        placeholder="blur"
        priority={priority}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}

export function CinematicHero({
  content,
  copy,
  locale,
  whatsappUrl,
}: {
  content: ElixirContent;
  copy: Copy;
  locale: Locale;
  whatsappUrl: string;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bottleY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[#080706] text-[#f5f0e8]"
      id="hero"
      ref={heroRef}
    >
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <ImagePanel
          alt="FONDJO RACINE volcanic stone bottle campaign"
          className="absolute inset-0"
          priority
          sizes="100vw"
          src={campaignImages.hero}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080706_0%,rgb(8_7_6/.88)_34%,rgb(8_7_6/.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgb(240_216_96/.28),transparent_28%),linear-gradient(180deg,transparent_65%,#080706_100%)]" />
      </motion.div>

      <Container className="relative z-10 grid min-h-[100svh] content-center gap-10 pb-28 pt-28 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: textY }}
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#d6b75b]">
            {t(content.hero.eyebrow, locale)}
          </p>
          <h1 className="mt-5 max-w-[11ch] font-serif text-[clamp(4rem,12vw,9.8rem)] font-light leading-[0.78] text-[#f6f0e4]">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#f6f0e4]/74 sm:text-lg">
            {t(content.description, locale)}
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d6b75b] px-6 text-sm font-semibold text-[#080706] shadow-[0_20px_70px_rgb(214_183_91/.28)] transition-transform hover:-translate-y-0.5"
              href="#checkout"
            >
              {copy.preorder}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#d6b75b]/45 bg-white/8 px-6 text-sm font-semibold text-[#f6f0e4] backdrop-blur-md transition-transform hover:-translate-y-0.5"
              href="#diagnosis"
            >
              {copy.diagnosis}
              <Bot className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/14 bg-black/20 px-6 text-sm font-semibold text-[#f6f0e4] backdrop-blur-md sm:hidden"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] lg:max-w-[36rem]"
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: bottleY }}
        >
          <div className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6b75b]/24 blur-3xl" />
          <motion.div
            className="absolute inset-[7%] overflow-hidden rounded-[0.6rem] border border-[#d6b75b]/28 shadow-[0_40px_120px_rgb(0_0_0/.55)]"
            animate={{ y: [0, -12, 0], rotate: [-0.8, 0.8, -0.8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              alt="FONDJO RACINE bottle floating in a reflective studio"
              blurDataURL={blurDataUrl}
              className="object-cover"
              fill
              placeholder="blur"
              priority
              sizes="(min-width: 1024px) 42vw, 82vw"
              src={campaignImages.reflection}
            />
            <div className="absolute inset-y-0 left-[18%] w-[12%] bg-white/14 blur-xl" />
          </motion.div>
          <div className="absolute bottom-4 left-4 right-4 border border-[#d6b75b]/22 bg-[#080706]/82 p-4 text-center backdrop-blur-xl">
            <p className="font-serif text-3xl text-[#d6b75b]">FONDJO RACINE</p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#f6f0e4]/72">
              {copy.batch} · {copy.price} · {copy.ships}
            </p>
          </div>
        </motion.div>
      </Container>

      <a
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#f6f0e4]/58 md:inline-flex"
        href="#origin"
      >
        {copy.scroll}
        <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="size-4" aria-hidden="true" />
        </motion.span>
      </a>
    </section>
  );
}

export function ProductShowcase({ copy }: { copy: Copy }) {
  return (
    <section className="border-y border-[#d6b75b]/14 bg-[#0d0b08] py-16" id="product">
      <Container className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <FadeUp className="grid grid-cols-2 gap-3 sm:gap-4">
          <ImagePanel
            alt="FONDJO RACINE front bottle label"
            className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
            sizes="(min-width: 1024px) 25vw, 50vw"
            src={campaignImages.frontLabel}
          />
          <ImagePanel
            alt="FONDJO RACINE back bottle label"
            className="relative mt-10 aspect-[3/4] overflow-hidden rounded-md border border-[#d6b75b]/18 bg-[#17130e]"
            sizes="(min-width: 1024px) 25vw, 50vw"
            src={campaignImages.backLabel}
          />
        </FadeUp>
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#d6b75b]">
            FONDJO RACINE SEVE
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6.6rem)] font-light leading-[0.86] text-[#f6f0e4]">
            One bottle. Thirty first rituals.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/68">{copy.scarcity}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Preorder", copy.price],
              ["Original", copy.originalPrice],
              ["Ship date", "July 6"],
            ].map(([label, value]) => (
              <div className="border border-[#d6b75b]/16 bg-white/[0.03] p-4" key={label}>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d6b75b]">
                  {label}
                </p>
                <p className="mt-2 font-mono text-sm text-[#f6f0e4]">{value}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export function OriginSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28" id="origin">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            {copy.story} · Buea / Mount Cameroon
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.86]">
            Origin with altitude.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#14110b]/70">{copy.origin}</p>
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

export function IngredientCarousel({
  content,
  copy,
  locale,
}: PremiumStorefrontPageProps & { copy: Copy }) {
  const ingredients = content.ingredientScience.ingredients.slice(0, 7);

  return (
    <section className="overflow-hidden bg-[#080706] py-20 text-[#f6f0e4] sm:py-28" id="formula">
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.formula}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.6rem,7vw,6.2rem)] font-light leading-[0.88]">
            Botanical oils, composed like fragrance notes.
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#f6f0e4]/65">{copy.ingredients}</p>
        </FadeUp>
      </Container>
      <motion.div
        className="mt-12 flex gap-4 px-5 sm:px-8"
        animate={{ x: ["0%", "-18%", "0%"] }}
        transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
      >
        {[...ingredients, ...ingredients].map((ingredient, index) => (
          <article
            className="min-w-[17rem] border border-[#d6b75b]/16 bg-white/[0.035] p-5 backdrop-blur"
            key={`${t(ingredient.name, locale)}-${index}`}
          >
            <Leaf className="size-5 text-[#d6b75b]" aria-hidden="true" />
            <h3 className="mt-8 font-serif text-3xl text-[#f6f0e4]">
              {t(ingredient.name, locale)}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/62">{t(ingredient.note, locale)}</p>
          </article>
        ))}
      </motion.div>
    </section>
  );
}

export function RitualSection({ copy }: { copy: Copy }) {
  return (
    <section className="bg-[#100d0a] text-[#f6f0e4]" id="ritual">
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
              Ritual
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.7rem,7vw,6rem)] font-light leading-[0.86]">
              A night routine with a slow gold finish.
            </h2>
            <p className="mt-6 text-sm leading-8 text-[#f6f0e4]/68">{copy.ritual}</p>
            <div className="mt-8 grid gap-4">
              {["Warm three drops", "Massage the scalp", "Seal the ends"].map((step, index) => (
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

export function LifestyleGallery() {
  const moments = [
    {
      src: campaignImages.market,
      text: "Daily movement, heat, dust, braids, errands.",
      title: "Buea market texture",
    },
    {
      src: campaignImages.barbershop,
      text: "Edges, beards, scalp, polished finish.",
      title: "Barbershop grooming",
    },
    {
      src: campaignImages.packing,
      text: "Batch #001 prepared by hand.",
      title: "Orders leaving Buea",
    },
  ];

  return (
    <section className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28" id="lifestyle">
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            Lifestyle
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.5rem,7vw,6.2rem)] font-light leading-[0.88]">
            Built for real life, styled like a campaign.
          </h2>
        </FadeUp>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {moments.map((moment, index) => (
            <FadeUp className={index === 1 ? "md:mt-14" : ""} key={moment.title}>
              <article className="group">
                <ImagePanel
                  alt={`FONDJO RACINE ${moment.title}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-md"
                  sizes="(min-width: 768px) 33vw, 100vw"
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
    <section className="bg-[#080706] py-20 text-[#f6f0e4] sm:py-28" id="batch">
      <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#d6b75b]">
            {copy.batch}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.82]">
            30 bottles. No silent restock.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[#f6f0e4]/68">{copy.scarcity}</p>
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
    <section className="bg-[#100d0a] py-20 text-[#f6f0e4] sm:py-28" id="diagnosis">
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
    <section className="bg-[#f4eddf] py-20 text-[#14110b] sm:py-28" id="checkout">
      <Container>
        <FadeUp className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#7b622d]">
            {copy.checkout}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.86]">
            Reserve Batch #001.
          </h2>
          <p className="mt-5 text-sm leading-8 text-[#14110b]/68">
            {copy.price} preorder. {copy.originalPrice} original price. WhatsApp, MTN MoMo, Orange
            Money, and Stripe placeholder are supported.
          </p>
        </FadeUp>
        <div className="mt-10 rounded-md border border-[#7b622d]/18 bg-[#fffaf0] p-3 shadow-[0_22px_90px_rgb(20_17_11/.12)] sm:p-5">
          <OrderFlow content={content} locale={locale} />
        </div>
      </Container>
    </section>
  );
}

export function StickyMobileCTA({ copy }: { copy: Copy }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 rounded-md border border-[#d6b75b]/18 bg-[#080706]/88 p-2 shadow-[0_18px_70px_rgb(0_0_0/.45)] backdrop-blur-xl md:hidden">
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d6b75b] px-3 text-center text-xs font-semibold text-[#080706]"
        href="#checkout"
      >
        {copy.preorder}
      </a>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/12 px-3 text-center text-xs font-semibold text-[#f6f0e4]"
        href="#diagnosis"
      >
        {copy.diagnosis}
      </a>
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

function PremiumHeader({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const alternateHref = (locale === "fr" ? "/" : "/fr") as Route;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080706]/70 text-[#f6f0e4] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href={(locale === "fr" ? "/fr" : "/") as Route}>
          <span className="relative size-9 overflow-hidden rounded-full border border-[#d6b75b]/35">
            <Image
              alt="FONDJO RACINE profile logo"
              className="object-cover"
              fill
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
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/62 lg:flex">
          {copy.nav.map((link) => (
            <a className="transition-colors hover:text-[#d6b75b]" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 px-3 text-sm font-semibold text-[#f6f0e4]/72"
            href={alternateHref}
          >
            <Globe2 className="size-4" aria-hidden="true" />
            {copy.language}
          </Link>
          <a
            className="inline-flex h-10 items-center rounded-md bg-[#d6b75b] px-4 text-sm font-semibold text-[#080706]"
            href="#checkout"
          >
            {copy.checkout}
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
            {copy.nav.map((link) => (
              <a
                className="min-h-12 px-3 py-3 text-sm font-semibold text-[#f6f0e4]/78"
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              className="min-h-12 px-3 py-3 text-sm font-semibold text-[#d6b75b]"
              href={alternateHref}
              onClick={() => setIsOpen(false)}
            >
              {copy.language}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function PremiumStorefrontPage({ content, locale }: PremiumStorefrontPageProps) {
  const copy = getCopy(locale);
  const whatsappUrl = getWhatsAppUrl(content, locale);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080706]">
      <PremiumHeader copy={copy} locale={locale} />
      <CinematicHero content={content} copy={copy} locale={locale} whatsappUrl={whatsappUrl} />
      <ProductShowcase copy={copy} />
      <OriginSection copy={copy} />
      <IngredientCarousel content={content} copy={copy} locale={locale} />
      <RitualSection copy={copy} />
      <LifestyleGallery />
      <BatchCountdown copy={copy} />
      <AIConsultationPreview content={content} copy={copy} locale={locale} />
      <PreorderCheckout content={content} copy={copy} locale={locale} />
      <section className="relative min-h-[28rem] overflow-hidden bg-[#080706]">
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
              Rooted in Buea.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.32em] text-[#f6f0e4]/58">
              Designed for the first thirty
            </p>
          </FadeUp>
        </Container>
      </section>
      <LuxuryFooter content={content} copy={copy} locale={locale} whatsappUrl={whatsappUrl} />
      <StickyMobileCTA copy={copy} />
    </main>
  );
}
