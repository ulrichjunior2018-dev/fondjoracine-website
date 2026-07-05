"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef } from "react";

import type { Locale } from "@/features/elixir/data/content";

// Same obsidian blur placeholder used across the storefront
const BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

// ─── Slider handle ─────────────────────────────────────────────────────────────

function SliderHandle() {
  return (
    // Gold circle with left/right chevrons indicating drag direction
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c8a951] shadow-[0_4px_20px_rgb(0_0_0/.40)] ring-2 ring-[#c8a951]/30">
      <ChevronLeft
        aria-hidden="true"
        className="absolute left-[5px] h-3.5 w-3.5 text-[#0a0905]"
        strokeWidth={3}
      />
      <ChevronRight
        aria-hidden="true"
        className="absolute right-[5px] h-3.5 w-3.5 text-[#0a0905]"
        strokeWidth={3}
      />
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

type ImageCompareSliderProps = {
  afterAlt: string;
  afterSrc: string;
  beforeAlt: string;
  beforeSrc: string;
  locale: Locale;
};

export function ImageCompareSlider({
  afterAlt,
  afterSrc,
  beforeAlt,
  beforeSrc,
  locale,
}: ImageCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // DOM refs — position updated directly to avoid any React re-render latency
  const lineRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const beforeLabelRef = useRef<HTMLSpanElement>(null);
  const afterLabelRef = useRef<HTMLSpanElement>(null);

  const applyPosition = useCallback((pct: number) => {
    const p = Math.max(2, Math.min(98, pct));

    if (lineRef.current) lineRef.current.style.left = `${p}%`;
    if (lineRef.current) lineRef.current.setAttribute("aria-valuenow", String(Math.round(p)));

    // After image is revealed from the left; clip hides right portion
    if (clipRef.current) clipRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;

    // Fade BEFORE label when slider crowds it (< ~18%)
    if (beforeLabelRef.current) {
      beforeLabelRef.current.style.opacity = p < 18 ? "0" : "1";
    }

    // Fade AFTER label when slider crowds it (> ~82%)
    if (afterLabelRef.current) {
      afterLabelRef.current.style.opacity = p > 82 ? "0" : "1";
    }
  }, []);

  // Pointer events — setPointerCapture ensures drag stays smooth on touch
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    applyPosition(((e.clientX - rect.left) / rect.width) * 100);
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const current = Number(e.currentTarget.getAttribute("aria-valuenow") ?? "50");
    const step = e.shiftKey ? 10 : 5;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      applyPosition(current - step);
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      applyPosition(current + step);
    }
  }

  const beforeLabel = locale.startsWith("fr") ? "AVANT" : "BEFORE";
  const afterLabel = locale.startsWith("fr") ? "APRÈS" : "AFTER";

  return (
    // touch-action: none prevents scroll interference during horizontal drag
    <div
      ref={containerRef}
      aria-label={`${beforeLabel} / ${afterLabel} comparison`}
      className="relative aspect-[3/4] w-full select-none overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* ── Before image (base layer, always fully visible) ── */}
      <Image
        alt={beforeAlt}
        blurDataURL={BLUR_URL}
        className="absolute inset-0 object-cover"
        fill
        loading="lazy"
        placeholder="blur"
        sizes="(min-width: 1024px) 40vw, 92vw"
        src={beforeSrc}
      />

      {/* ── After image clipped from the right, default 50% revealed ── */}
      <div
        ref={clipRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 50% 0 0)", willChange: "clip-path" }}
      >
        <Image
          alt={afterAlt}
          blurDataURL={BLUR_URL}
          className="absolute inset-0 object-cover"
          fill
          loading="lazy"
          placeholder="blur"
          sizes="(min-width: 1024px) 40vw, 92vw"
          src={afterSrc}
        />
      </div>

      {/* ── BEFORE label (top-left) ── */}
      <span
        ref={beforeLabelRef}
        className="pointer-events-none absolute left-3 top-3 rounded bg-black/52 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-opacity duration-200"
        aria-hidden="true"
      >
        {beforeLabel}
      </span>

      {/* ── AFTER label (top-right) ── */}
      <span
        ref={afterLabelRef}
        className="pointer-events-none absolute right-3 top-3 rounded bg-black/52 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-opacity duration-200"
        aria-hidden="true"
      >
        {afterLabel}
      </span>

      {/* ── Slider: vertical line + draggable handle ── */}
      <div
        ref={lineRef}
        aria-label={locale.startsWith("fr") ? "Glisser pour comparer" : "Drag to compare"}
        aria-orientation="vertical"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={50}
        className="absolute inset-y-0 flex cursor-ew-resize touch-none flex-col items-center justify-center"
        role="slider"
        tabIndex={0}
        style={{ left: "50%", willChange: "left" }}
        onKeyDown={onKeyDown}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Vertical gold line */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-[2px] bg-[#c8a951]"
          style={{ left: "-1px" }}
        />
        {/* Grab handle */}
        <SliderHandle />
      </div>
    </div>
  );
}
