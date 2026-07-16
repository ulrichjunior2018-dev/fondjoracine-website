"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion/gsap";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Single source of truth for the scroll loop and the motion layer boot.
 *
 * Enable/disable conditions for Lenis are unchanged (coarse pointer /
 * reduced-motion / constrained network). GSAP/ScrollTrigger is registered here so
 * the whole app shares one scroll loop:
 *
 * - Lenis active  → GSAP's ticker drives `lenis.raf`, and each Lenis scroll updates
 *   ScrollTrigger. One loop, no jitter, no scroll hijack regressions.
 * - Lenis disabled → ScrollTrigger falls back to native scroll automatically.
 *
 * Purely additive: with no ScrollTrigger animations registered yet, scroll
 * behaves exactly as before.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    registerGsap();

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const constrainedNetwork =
      connection?.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

    if (isCoarsePointer || reducedMotion || constrainedNetwork) {
      // Native scroll: ScrollTrigger works on its own; just ensure measurements.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    const onScroll = () => ScrollTrigger.update();
    const drive = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(drive);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(drive);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
