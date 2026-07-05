"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { ElixirContent, Locale } from "@/features/elixir/data/content";

// ─── Production note ───────────────────────────────────────────────────────────
//
// FLAGGED FOR CLIENT — BOTH VIDEO PANELS NEED AN ORIGINAL SHOOT IN BUEA.
// Do NOT use stock footage. Poster images below are temporary stand-ins only.
//
//   Left panel : Macro botanical sourcing — hands harvesting botanicals,
//                distillation process, plant close-ups in Buea / SW Region.
//   Right panel: Fast-cut montage — Sève applied across 4 hair patterns:
//                final Maison Fondjo motion assets.
//
// Recommended specs: 1920×1080 H.264 MP4 + WebM fallback, ≤ 8 MB each.
// Drop files at /public/videos/ and uncomment the src props below.

// ─── Video panel ───────────────────────────────────────────────────────────────

type VideoPanelProps = {
  poster: string;
  side: "left" | "right";
  // FIXME(client): uncomment and point to real footage once available
  // src: string;
};

function VideoPanel({ poster, side }: VideoPanelProps) {
  // Static poster fills the space until video files exist.
  // Replace <img> with <video autoPlay muted loop playsInline poster={poster}> when ready.
  return (
    <div className="relative h-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={
          side === "left"
            ? "Botanical sourcing in Buea, Cameroon (video placeholder)"
            : "Sève Racine campaign image placeholder"
        }
        className="absolute inset-0 h-full w-full object-cover"
        src={poster}
      />

      {/* Gradient pulls edges toward void for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            side === "left"
              ? "linear-gradient(to right, var(--fr-void) 0%, transparent 50%)"
              : "linear-gradient(to left,  var(--fr-void) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────

type HeroSectionProps = {
  content: ElixirContent;
  locale: Locale;
};

export function HeroSection(_props: HeroSectionProps) {
  void _props;

  return (
    <section
      className="relative flex min-h-svh flex-col overflow-hidden"
      id="hero"
      style={{ backgroundColor: "var(--fr-void)" }}
    >
      {/* ── Split-screen video (50 / 50 desktop, stacked mobile) ──────── */}
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
        <VideoPanel poster="/images/hero-origin.png" side="left" />
        <VideoPanel poster="/images/hair-texture-lifestyle.png" side="right" />
      </div>

      {/* 1 px gold vertical divider — desktop only */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 z-10 hidden w-px sm:block"
        style={{ backgroundColor: "var(--fr-gold)", opacity: 0.65 }}
      />

      {/* Unified dark overlay for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{ backgroundColor: "var(--fr-void)", opacity: 0.52 }}
      />

      {/* ── Centred overlay content ───────────────────────────────────── */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-5 pb-24 pt-28 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[56rem]"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow — JetBrains Mono */}
          <p
            className="mb-7 font-jetbrains text-[0.62rem] font-medium uppercase tracking-[0.38em]"
            style={{ color: "var(--fr-gold)" }}
          >
            Maison Fondjo · Sève Racine · 100&thinsp;ml
          </p>

          {/* H1 — Fraunces display, italic on "Buea" */}
          <h1
            className="font-fraunces text-[2.6rem] font-light leading-[1.04] sm:text-[4rem] lg:text-[5.5rem]"
            style={{ color: "var(--fr-ivory)" }}
          >
            One universal oil. <span className="block sm:inline">Everyday discipline.</span>{" "}
            <span className="block sm:inline">
              Born in{" "}
              <em
                className="font-fraunces not-italic"
                style={{ color: "var(--fr-gold)", fontStyle: "italic" }}
              >
                Buea.
              </em>
            </span>
          </h1>

          {/* H2 subheadline — Inter body, ivory at 80% opacity, max 42ch */}
          <p
            className="mx-auto mt-7 max-w-[42ch] text-base leading-[1.85]"
            style={{ color: "color-mix(in srgb, var(--fr-ivory) 80%, transparent)" }}
          >
            Sève is a single-source, raw botanical treatment engineered to repair, hydrate, and
            protect every hair pattern — cultivated in Cameroon, delivered worldwide.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <motion.a
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-88"
              href="#order"
              initial={{ opacity: 0, y: 10 }}
              style={{ backgroundColor: "var(--fr-gold)", color: "var(--fr-void)" }}
              transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              Discover SÈVE
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </motion.a>

            <motion.a
              animate={{ opacity: 1 }}
              className="text-sm font-medium underline underline-offset-4 hover:no-underline"
              href="#diagnosis"
              initial={{ opacity: 0 }}
              style={{ color: "color-mix(in srgb, var(--fr-ivory) 65%, transparent)" }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              Start free hair diagnosis →
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <div
            className="flex h-9 w-5 items-start justify-center rounded-full border pt-1.5"
            style={{ borderColor: "color-mix(in srgb, var(--fr-ivory) 28%, transparent)" }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              className="h-1.5 w-1 rounded-full"
              style={{ backgroundColor: "var(--fr-gold)" }}
              transition={{ duration: 1.7, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
