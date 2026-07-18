"use client";

import type { ReactNode } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Native browser scrolling (+ CSS `scroll-behavior: smooth` for anchors).
 * GSAP is registered only inside components that animate (e.g. CinematicHero),
 * not on every route.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}
