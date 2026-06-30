"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";

// ─── Static metadata ──────────────────────────────────────────────────────────

// Origin per ingredient (not in CMS schema — stable factual data)
const ORIGINS: Array<{ en: string; fr: string }> = [
  { en: "West Africa", fr: "Afrique de l'Ouest" },
  { en: "West Africa", fr: "Afrique de l'Ouest" },
  { en: "Mediterranean", fr: "Méditerranée" },
  { en: "Europe & Americas", fr: "Europe & Amériques" },
  { en: "Tropical regions", fr: "Régions tropicales" },
  { en: "Morocco", fr: "Maroc" },
  { en: "Natural sources", fr: "Sources naturelles" },
  { en: "West Africa", fr: "Afrique de l'Ouest" },
];

// Unique gradient per card — same dark green palette, gold accent at different angles
const CARD_GRADIENTS = [
  "radial-gradient(ellipse at 20% 30%, rgb(200 169 81 / .07) 0%, transparent 55%), linear-gradient(135deg, #060e08, #0a1a0e)",
  "radial-gradient(ellipse at 80% 20%, rgb(200 169 81 / .06) 0%, transparent 50%), linear-gradient(160deg, #050d08, #0c1a12)",
  "radial-gradient(ellipse at 50% 70%, rgb(200 169 81 / .08) 0%, transparent 55%), linear-gradient(120deg, #07100a, #0b1a0d)",
  "radial-gradient(ellipse at 30% 80%, rgb(200 169 81 / .07) 0%, transparent 50%), linear-gradient(145deg, #060d08, #0d1b0f)",
  "radial-gradient(ellipse at 70% 40%, rgb(200 169 81 / .06) 0%, transparent 55%), linear-gradient(155deg, #06100a, #0a180d)",
  "radial-gradient(ellipse at 20% 55%, rgb(200 169 81 / .08) 0%, transparent 50%), linear-gradient(130deg, #080d07, #0e1b0a)",
  "radial-gradient(ellipse at 60% 20%, rgb(200 169 81 / .07) 0%, transparent 55%), linear-gradient(150deg, #060f0b, #0c1a0f)",
  "radial-gradient(ellipse at 40% 65%, rgb(200 169 81 / .06) 0%, transparent 50%), linear-gradient(140deg, #070e09, #0b190e)",
];

// ─── Desktop card ─────────────────────────────────────────────────────────────

type DesktopCardProps = {
  index: number;
  ingredient: ElixirContent["ingredientScience"]["ingredients"][number];
  isLast: boolean;
  locale: Locale;
  scrollYProgress: MotionValue<number>;
  total: number;
};

function DesktopCard({
  index,
  ingredient,
  isLast,
  locale,
  scrollYProgress,
  total,
}: DesktopCardProps) {
  const [revealed, setRevealed] = useState(false);

  // Trigger reveal when scroll reaches this card's zone
  const triggerAt = Math.max(0, index / (total - 1) - 0.08);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!revealed && p >= triggerAt) {
      setRevealed(true);
    }
  });

  const name = t(ingredient.name, locale);
  const note = t(ingredient.note, locale);
  const origin = locale === "fr" ? (ORIGINS[index]?.fr ?? "") : (ORIGINS[index]?.en ?? "");
  const words = note.split(" ");
  const num = String(index + 1).padStart(2, "0");
  const gradient = CARD_GRADIENTS[index] ?? CARD_GRADIENTS[0]!;

  return (
    <div
      aria-label={name}
      className="relative flex h-full w-[70vw] shrink-0 flex-col justify-center overflow-hidden px-12 lg:px-20"
      style={{ background: gradient }}
    >
      {/* Oversized decorative number — 0.05 opacity, behind content */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[18vw] font-light leading-none text-[#FAF7F0]"
        style={{ opacity: 0.05 }}
      >
        {num}
      </span>

      {/* Right-edge separator */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-[#c8a951]/12" />

      <div className="relative max-w-[520px]">
        {/* Number / index label */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a951]/50">
          {num} of {String(total).padStart(2, "0")}
        </p>

        {/* Ingredient name — left-to-right clip-path wipe */}
        <div className="overflow-hidden">
          <motion.h3
            animate={revealed ? { clipPath: "inset(0 0% 0 0)" } : {}}
            className="font-serif text-[3.5rem] font-light leading-[1.05] text-[#FAF7F0] lg:text-[4.5rem]"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {name}
          </motion.h3>
        </div>

        {/* Origin tag — fades in 0.2s after name wipe starts */}
        <motion.p
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#c8a951]"
          initial={{ opacity: 0, y: 6 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {origin}
        </motion.p>

        {/* Benefit description — word-by-word stagger */}
        <p aria-label={note} className="mt-6 text-base leading-8 text-[#FAF7F0]/65">
          {words.map((word, wi) => (
            <motion.span
              key={wi}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              className="inline-block"
              initial={{ opacity: 0, y: 8 }}
              style={{ marginRight: "0.28em" }}
              transition={{
                delay: 0.35 + wi * 0.04,
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* CTA on final card */}
        {isLast ? (
          <motion.a
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            className="mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-[#c8a951] px-6 text-sm font-semibold text-[#FAF7F0] transition-colors hover:bg-[#c8a951]/14"
            href="#how-to-use"
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {locale === "fr" ? "Voir la formule complète" : "See the full formula"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type IngredientGalleryProps = {
  content: ElixirContent;
  locale: Locale;
};

export function IngredientGallery({ content, locale }: IngredientGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Derive horizontal translation from track's actual scroll width — handles resize correctly
  const x = useTransform(scrollYProgress, (p) => {
    if (!trackRef.current) return 0;
    const travel = trackRef.current.scrollWidth - window.innerWidth;
    return -p * travel;
  });

  // Progress bar fill
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const ingredients = content.ingredientScience.ingredients;
  const eyebrow = t(content.ingredientScience.eyebrow, locale);
  const title = t(content.ingredientScience.title, locale);

  return (
    // Single section — md:h-[250vh] creates the scroll space for the sticky panel.
    // On mobile (below md) height is auto and the sticky panel is hidden.
    <section
      ref={containerRef}
      className="relative bg-[#072011] text-[#FAF7F0] md:h-[250vh]"
      id="ingredients"
    >
      {/* ── Mobile: vertical list (no scroll-jacking below 768px) ────────── */}
      <div className="block py-16 md:hidden">
        <div className="px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d5a72f]">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-[#FAF7F0]">{title}</h2>

          <div className="mt-10 space-y-10">
            {ingredients.map((ingredient, i) => {
              const name = t(ingredient.name, locale);
              const note = t(ingredient.note, locale);
              const origin = locale === "fr" ? (ORIGINS[i]?.fr ?? "") : (ORIGINS[i]?.en ?? "");

              return (
                <div className="border-b border-[#c8a951]/16 pb-10" key={name}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c8a951]">
                    {String(i + 1).padStart(2, "0")} — {origin}
                  </p>
                  <h3 className="font-serif text-2xl font-light text-[#FAF7F0]">{name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#FAF7F0]/65">{note}</p>
                </div>
              );
            })}

            <a
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#c8a951] px-5 text-sm font-semibold text-[#FAF7F0] transition-colors hover:bg-[#c8a951]/14"
              href="#how-to-use"
            >
              {locale === "fr" ? "Voir la formule complète" : "See the full formula"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Desktop: sticky horizontal gallery (md+) ───────────────────────── */}
      <div className="sticky top-0 hidden h-screen overflow-hidden md:block">
        {/* Header strip */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-end justify-between px-12 py-8 lg:px-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d5a72f]">
              {eyebrow}
            </p>
            <h2 className="mt-2 max-w-md font-serif text-2xl font-light text-[#FAF7F0] lg:text-3xl">
              {title}
            </h2>
          </div>
          <p
            aria-hidden="true"
            className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-[#FAF7F0]/36 lg:block"
          >
            {locale === "fr" ? "Défiler pour explorer" : "Scroll to explore"}
          </p>
        </div>

        {/* Horizontal track — translates left as user scrolls down */}
        <motion.div ref={trackRef} className="flex h-full items-stretch pt-28" style={{ x }}>
          {ingredients.map((ingredient, i) => (
            <DesktopCard
              key={t(ingredient.name, locale)}
              index={i}
              ingredient={ingredient}
              isLast={i === ingredients.length - 1}
              locale={locale}
              scrollYProgress={scrollYProgress}
              total={ingredients.length}
            />
          ))}
        </motion.div>

        {/* Live progress bar — thin gold line at bottom */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[#c8a951]/15">
          <motion.div className="h-full bg-[#c8a951]" style={{ width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}
