"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

// ─── Data ──────────────────────────────────────────────────────────────────────

type TextureId = "fine" | "waves" | "curly" | "coiled";

type Texture = {
  claim: string; // defensible outcome claim only — no unverifiable growth stats
  id: TextureId;
  label: string;
  poster: string; // PRODUCTION: replace with texture-specific video src
};

const TEXTURES: Texture[] = [
  {
    id: "fine",
    label: "Fine & Straight",
    // Claim verified against formula: lightweight carrier oils absorb rapidly
    claim: "Lightweight — absorbs fast, zero residue or grease",
    poster: "/images/studio-reflection.png",
  },
  {
    id: "waves",
    label: "Waves & Frizz",
    // Claim verified: botanical emollients smooth the cuticle without film-forming agents
    claim: "Defines movement — smooths the cuticle without weighing waves down",
    poster: "/images/hero-origin.png",
  },
  {
    id: "curly",
    label: "Curly & Thick",
    // Claim verified: penetrating oils (baobab, castor) seal moisture in cortex
    claim: "Seals moisture — penetrates before locking hydration in",
    poster: "/images/hair-texture-lifestyle.png",
  },
  {
    id: "coiled",
    label: "Coiled & 4C",
    // Claim verified: high slip + occlusives soften tight coil pattern
    claim: "Softens and stretches — deeply conditions tight coils and edges",
    poster: "/images/night-routine.png",
  },
];

// ─── Texture icons (inline SVG) ───────────────────────────────────────────────

function FineIcon() {
  return (
    <svg aria-hidden="true" fill="none" height={32} viewBox="0 0 40 40" width={32}>
      <line stroke="currentColor" strokeWidth="1.4" x1="5" x2="35" y1="13" y2="13" />
      <line stroke="currentColor" strokeWidth="1.4" x1="5" x2="35" y1="20" y2="20" />
      <line stroke="currentColor" strokeWidth="1.4" x1="5" x2="35" y1="27" y2="27" />
    </svg>
  );
}

function WavesIcon() {
  return (
    <svg aria-hidden="true" fill="none" height={32} viewBox="0 0 40 40" width={32}>
      <path
        d="M4 14 C8 8, 12 26, 16 20 S24 8, 28 14 S34 26, 38 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M4 26 C8 20, 12 32, 16 26 S24 18, 28 24 S34 32, 38 26"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CurlyIcon() {
  return (
    <svg aria-hidden="true" fill="none" height={32} viewBox="0 0 40 40" width={32}>
      <path
        d="M12 32 Q8 22 14 16 Q20 10 26 16 Q32 22 28 30"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M22 34 Q18 26 22 22 Q26 18 30 22 Q34 26 30 32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CoiledIcon() {
  return (
    <svg aria-hidden="true" fill="none" height={32} viewBox="0 0 40 40" width={32}>
      {/* Concentric arcs reading as a tight coil/spring */}
      <path
        d="M20 21 a2 2 0 1 1 -4 0 a4 4 0 1 1 8 0 a6 6 0 1 1 -12 0 a8 8 0 1 1 16 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

const ICONS: Record<TextureId, React.FC> = {
  fine: FineIcon,
  waves: WavesIcon,
  curly: CurlyIcon,
  coiled: CoiledIcon,
};

// ─── Texture card ─────────────────────────────────────────────────────────────

type CardProps = {
  isSelected: boolean;
  onSelect: () => void;
  texture: Texture;
};

function TextureCard({ isSelected, onSelect, texture }: CardProps) {
  const Icon = ICONS[texture.id];

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "group flex flex-col gap-3 rounded-sm p-5 text-left transition-all duration-200",
        isSelected
          ? "bg-[color-mix(in_srgb,var(--fr-void)_60%,transparent)]"
          : "hover:bg-[color-mix(in_srgb,var(--fr-void)_40%,transparent)]",
      )}
      onClick={onSelect}
      style={{
        border: isSelected
          ? "2px solid var(--fr-gold)"
          : "1px solid color-mix(in srgb, var(--fr-ivory) 14%, transparent)",
      }}
      type="button"
    >
      {/* Icon */}
      <span
        className="transition-colors duration-200"
        style={{
          color: isSelected
            ? "var(--fr-gold)"
            : "color-mix(in srgb, var(--fr-ivory) 52%, transparent)",
        }}
      >
        <Icon />
      </span>

      {/* Label — Fraunces display */}
      <span
        className="block font-fraunces text-lg font-light leading-tight"
        style={{
          color: isSelected
            ? "var(--fr-ivory)"
            : "color-mix(in srgb, var(--fr-ivory) 80%, transparent)",
        }}
      >
        {texture.label}
      </span>

      {/* Claim — Inter body, small */}
      <span
        className="block text-xs leading-snug"
        style={{ color: "color-mix(in srgb, var(--fr-ivory) 52%, transparent)" }}
      >
        {texture.claim}
      </span>
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

export function TextureGrid() {
  const [selected, setSelected] = useState<TextureId>("fine");
  const active = TEXTURES.find((t) => t.id === selected)!;

  return (
    <section
      className="py-16 sm:py-20"
      id="textures"
      style={{ backgroundColor: "var(--fr-forest)" }}
    >
      <div className="mx-auto max-w-5xl px-5">
        {/* Section label */}
        <p
          className="mb-8 font-jetbrains text-[0.6rem] uppercase tracking-[0.35em]"
          style={{ color: "color-mix(in srgb, var(--fr-gold) 70%, transparent)" }}
        >
          Sève works across every pattern — select yours
        </p>

        {/* ── Texture-specific media display ───────────────────────────── */}
        {/*
         * PRODUCTION NOTE:
         * Replace each Image below with a <video> element once texture-specific
         * footage exists. Suggested src naming: /videos/texture-{id}.mp4
         * Each clip should be ~6s, looping, showing Sève being applied to
         * that specific hair pattern, muted, playsInline.
         */}
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Image
                alt={`Sève oil applied to ${active.label} hair (texture preview)`}
                blurDataURL={BLUR}
                className="object-cover"
                fill
                loading="lazy"
                placeholder="blur"
                sizes="(min-width: 1024px) 60vw, 95vw"
                src={active.poster}
              />

              {/* Bottom gradient + texture label overlay */}
              <div
                className="absolute inset-x-0 bottom-0 flex items-end p-5"
                style={{
                  background: "linear-gradient(to top, var(--fr-void) 0%, transparent 60%)",
                }}
              >
                <div>
                  <p
                    className="font-jetbrains text-[0.6rem] uppercase tracking-[0.3em]"
                    style={{ color: "var(--fr-gold)" }}
                  >
                    Pattern
                  </p>
                  <p
                    className="mt-1 font-fraunces text-xl font-light"
                    style={{ color: "var(--fr-ivory)" }}
                  >
                    {active.label}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Texture selector — 4-up desktop / 2×2 mobile ─────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TEXTURES.map((texture) => (
            <TextureCard
              key={texture.id}
              isSelected={selected === texture.id}
              onSelect={() => setSelected(texture.id)}
              texture={texture}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
