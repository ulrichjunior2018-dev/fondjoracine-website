/**
 * Runtime motion media helpers (client-only). Safe to call inside effects /
 * `useGSAP` callbacks — not during SSR render.
 */

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(pointer: coarse)").matches;
}

/** Prefer lighter timelines on touch / coarse pointer while still animating. */
export function motionIntensity(): "desktop" | "mobile" {
  return isCoarsePointer() ? "mobile" : "desktop";
}
