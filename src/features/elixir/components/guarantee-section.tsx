"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";

// ─── Easing ───────────────────────────────────────────────────────────────────

function easeOutExpo(progress: number): number {
  return progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);
}

// ─── Counter hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, durationMs: number, active: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const startTime = performance.now();
    let rafId: number;

    function frame() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, durationMs]);

  return value;
}

// ─── Ring + counter ───────────────────────────────────────────────────────────

const RING_SIZE = 184;
const RING_CX = RING_SIZE / 2;
const RING_CY = RING_SIZE / 2;
const RING_R = 80;

function AnimatedRingCounter({
  active,
  locale,
  skipAnimation,
}: {
  active: boolean;
  locale: Locale;
  skipAnimation: boolean;
}) {
  const count = skipAnimation ? 60 : useCountUp(60, 1800, active); // eslint-disable-line react-hooks/rules-of-hooks

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      {/* Ring — rotated so stroke starts at 12 o'clock */}
      <svg
        aria-hidden="true"
        className="absolute inset-0"
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Dim track */}
        <circle
          cx={RING_CX}
          cy={RING_CY}
          r={RING_R}
          fill="none"
          stroke="rgb(200 169 81 / .14)"
          strokeWidth="2"
        />
        {/* Animated fill */}
        <motion.circle
          cx={RING_CX}
          cy={RING_CY}
          r={RING_R}
          fill="none"
          stroke="#c8a951"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: skipAnimation ? 1 : 0 }}
          animate={active || skipAnimation ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Centered number display */}
      <div className="relative text-center" aria-label="60 days">
        <span className="block font-serif text-[3.5rem] font-light leading-none text-[#c8a951]">
          {count}
        </span>
        <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-foreground/48">
          {locale.startsWith("fr") ? "jours" : "days"}
        </span>
      </div>
    </div>
  );
}

// ─── Step card with SVG border trace ─────────────────────────────────────────

// Closed rectangle path in a 0 0 100 100 viewBox, traced clockwise from top-left
const BORDER_PATH = "M 1,1 L 99,1 L 99,99 L 1,99 Z";

function StepCard({
  badge,
  delay,
  index,
  inView,
  locale,
  skipAnimation,
}: {
  badge: ElixirContent["guarantee"]["badges"][number];
  delay: number;
  index: number;
  inView: boolean;
  locale: Locale;
  skipAnimation: boolean;
}) {
  const label = t(badge, locale);

  return (
    <motion.div
      className="relative cursor-default rounded-xl bg-[#0f0e0a] p-6"
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      whileHover={{
        y: -4,
        boxShadow: "0 20px 44px rgb(200 169 81 / .20), 0 0 0 1px rgb(200 169 81 / .28)",
      }}
    >
      {/* SVG border trace — preserveAspectRatio="none" stretches to card size */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible rounded-xl"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Static dim base border */}
        <path
          d={BORDER_PATH}
          fill="none"
          stroke="rgb(200 169 81 / .14)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Animated gold trace */}
        <motion.path
          d={BORDER_PATH}
          fill="none"
          stroke="#c8a951"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: skipAnimation ? 1 : 0 }}
          animate={inView || skipAnimation ? { pathLength: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: skipAnimation ? 0 : delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>

      {/* Step number */}
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[#c8a951]/52">
        {String(index + 1).padStart(2, "0")}
      </p>

      {/* Step label */}
      <p className="mt-3 text-sm font-medium leading-6 text-foreground/90">{label}</p>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

type GuaranteeSectionProps = {
  content: ElixirContent;
  locale: Locale;
};

export function GuaranteeSection({ content, locale }: GuaranteeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion() ?? false;

  // Single inView trigger — fires once when section enters at -120px margin
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });

  const eyebrow = t(content.guarantee.eyebrow, locale);
  const title = t(content.guarantee.title, locale);
  const intro = content.guarantee.intro ? t(content.guarantee.intro, locale) : null;
  const terms = t(content.guarantee.terms, locale);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-16 sm:py-24"
      id="guarantee"
    >
      {/* Animated gradient mesh — 20s loop, barely perceptible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[meshShift_20s_ease-in-out_infinite]"
        style={{
          background:
            "linear-gradient(135deg, transparent 15%, rgb(200 169 81 / .05) 40%, transparent 58%, rgb(200 169 81 / .04) 78%, transparent 92%)",
          backgroundSize: "300% 300%",
        }}
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          {/* ── Left: ring + text ─────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <motion.p
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8a951]"
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {eyebrow}
            </motion.p>

            {/* Title */}
            <motion.h2
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="mt-3 text-2xl font-semibold leading-[1.2] sm:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.h2>

            {/* Ring + counter */}
            <motion.div
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              className="my-8"
              initial={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedRingCounter
                active={inView}
                locale={locale}
                skipAnimation={prefersReducedMotion}
              />
            </motion.div>

            {/* Intro */}
            {intro ? (
              <motion.p
                animate={inView ? { opacity: 1, y: 0 } : {}}
                className="text-sm leading-7 text-foreground/68"
                initial={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {intro}
              </motion.p>
            ) : null}

            {/* Terms */}
            <motion.p
              animate={inView ? { opacity: 1 } : {}}
              className="mt-5 text-xs leading-5 text-foreground/42"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {terms}
            </motion.p>
          </div>

          {/* ── Right: step cards ─────────────────────────────────────────── */}
          <div ref={cardsRef} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
            {content.guarantee.badges.map((badge, i) => (
              <StepCard
                key={t(badge, locale)}
                badge={badge}
                delay={i * 0.15}
                index={i}
                inView={cardsInView}
                locale={locale}
                skipAnimation={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
