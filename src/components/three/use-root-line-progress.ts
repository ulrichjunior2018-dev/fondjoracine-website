"use client";

import { useEffect, useState } from "react";

export const BRANCH_LO = 0.4;
export const BRANCH_HI = 0.55;

export const BRANCH_INGREDIENTS = [
  "Menthe",
  "Moringa",
  "Graine noire",
  "Laurier",
  "Ricin",
  "Coco",
  "Olive",
  "Amande douce",
  "Avocat",
  "Argan",
  "Jojoba",
] as const;

/** Triangle envelope: 0 at BRANCH_LO, peak 1 at midpoint, 0 at BRANCH_HI */
export function getBranchPhase(progress: number): number {
  if (progress <= BRANCH_LO || progress >= BRANCH_HI) return 0;
  const mid = (BRANCH_LO + BRANCH_HI) / 2;
  return progress <= mid
    ? (progress - BRANCH_LO) / (mid - BRANCH_LO)
    : 1 - (progress - mid) / (BRANCH_HI - mid);
}

/**
 * Per-node opacity: staggered entry (nodes reveal sequentially),
 * uniform exit (all retract together).
 */
export function getNodePhase(progress: number, phase: number, index: number): number {
  const mid = (BRANCH_LO + BRANCH_HI) / 2;
  if (progress <= mid) {
    return Math.max(0, Math.min(1, (phase - index * 0.06) / 0.35));
  }
  return phase;
}

type ProgressTarget = {
  current: HTMLElement | null;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getRootLineScrollProgress(target?: HTMLElement | null) {
  if (typeof window === "undefined") {
    return 0;
  }

  if (!target) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollable <= 0) {
      return 0;
    }

    return clampProgress(window.scrollY / scrollable);
  }

  const rect = target.getBoundingClientRect();
  const travel = rect.height + window.innerHeight;
  const passed = window.innerHeight - rect.top;

  return travel > 0 ? clampProgress(passed / travel) : 0;
}

export function useRootLineProgress(target?: ProgressTarget) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setProgress(getRootLineScrollProgress(target?.current));
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return progress;
}
