"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { ReactNode } from "react";

import { gsap, registerGsap } from "@/lib/motion/gsap";
import { motionIntensity } from "@/lib/motion/media";
import { cn } from "@/lib/utils/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string | undefined;
  /** Stagger direct children (editorial section reveals). Default false. */
  staggerChildren?: boolean;
};

/**
 * Section entrance via ScrollTrigger. Content stays visible by default (no
 * "invisible until JS" trap). With `prefers-reduced-motion: no-preference`,
 * GSAP animates from a soft y/opacity offset once the section enters view.
 *
 * Mobile (coarse pointer): shorter travel + slightly snappier timing; still runs.
 * Desktop: fuller editorial rise.
 */
export function ScrollReveal({ children, className, staggerChildren = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intensity = motionIntensity();
        const y = intensity === "mobile" ? 18 : 28;
        const duration = intensity === "mobile" ? 0.55 : 0.85;
        const targets = staggerChildren ? root.querySelectorAll<HTMLElement>(":scope > *") : root;

        if (staggerChildren && targets instanceof NodeList && targets.length === 0) {
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            ease: "power2.out",
            stagger: staggerChildren ? (intensity === "mobile" ? 0.06 : 0.1) : 0,
            scrollTrigger: {
              trigger: root,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className={cn(className)} ref={ref}>
      {children}
    </div>
  );
}
