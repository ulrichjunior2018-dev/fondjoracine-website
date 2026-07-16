import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP entry point (motion layer).
 *
 * Import `gsap` / `ScrollTrigger` from here (not directly from the package) and
 * call `registerGsap()` once on the client before using ScrollTrigger. This keeps
 * plugin registration in a single place and avoids double-registration under React
 * strict mode. GSAP must only run client-side — never import this into a Server
 * Component's render path.
 */

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * True when the user prefers reduced motion (or during SSR, where we assume no
 * motion so content renders in its final, visible state). Use with
 * `gsap.matchMedia()` for per-animation gating.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
