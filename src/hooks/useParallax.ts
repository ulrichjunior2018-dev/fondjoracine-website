"use client";

import { useTransform } from "framer-motion";
import type { RefObject } from "react";

import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Returns a MotionValue<number> for a Y pixel offset driven by scroll.
 *
 * speed 0.3 → subtle background drift  (~60px total travel)
 * speed 0.5 → standard parallax        (~100px total travel)
 * speed 1.0 → dramatic foreground push (~200px total travel)
 * negative  → reverse direction
 *
 * Usage:
 *   const y = useParallax(ref, 0.4)
 *   <motion.div style={{ y }}>...</motion.div>
 */
export function useParallax(ref: RefObject<HTMLElement | null>, speed: number = 0.5) {
  const progress = useScrollProgress(ref);
  return useTransform(progress, [0, 1], [speed * 100, speed * -100]);
}
