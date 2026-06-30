"use client";

import { useScroll } from "framer-motion";
import type { RefObject } from "react";

/**
 * Returns a MotionValue<number> from 0 → 1 as the element scrolls
 * from entering the bottom of the viewport to leaving the top.
 * Matches the offset used in product-3d-scene for consistency.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return scrollYProgress;
}
