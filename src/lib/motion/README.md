# `src/lib/motion` — GSAP motion layer

**Layer:** Infrastructure (client-only presentation support)
**May import:** `gsap` and its plugins
**Must NOT:** run on the server — never import into a Server Component's render path. GSAP code runs in effects / `"use client"` modules only.

## What this folder is for

The single entry point for GSAP. Centralizing it keeps plugin registration in one place (no double-registration under React strict mode) and gives every animation the same reduced-motion gate. The scroll loop itself is owned by `src/providers/smooth-scroll-provider.tsx` (Lenis ↔ ScrollTrigger, one `gsap.ticker` loop).

## What lives here

- **`gsap.ts`** — re-exports `gsap` + `ScrollTrigger`, `registerGsap()` (idempotent, client-only plugin registration), and `prefersReducedMotion()` (SSR-safe; assumes no motion during SSR so content renders in its final state).

## How to add a scroll-triggered animation (Phase 1+)

1. Prefer the shared `ScrollReveal` component (`@/components/motion/scroll-reveal`) for section rises — it already gates on reduced-motion and uses **lighter motion on mobile**.
2. For custom sequences: `"use client"` + `useGSAP` + import `{ gsap, ScrollTrigger, registerGsap }` from `@/lib/motion/gsap`, and `motionIntensity()` from `@/lib/motion/media`.
3. Gate non-essential motion behind `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`.
4. **Mobile:** Lenis is off on coarse pointers; ScrollTrigger uses native scroll. Keep distances/durations lighter via `motionIntensity() === "mobile"` — do not disable GSAP on touch.
5. Animate `transform`/`opacity` only; never leave content invisible without a reduced-motion / no-JS-safe path.
6. Own each element with **one** library — don't double-animate with Framer Motion.

## Rules & boundaries

- Client-only; SSR-safe guards required (`typeof window === "undefined"`).
- Do not touch brand tokens, fonts, or copy — motion is presentational polish only.
- Keep the scroll loop single-sourced in the smooth-scroll provider; don't spin up competing RAF loops.

## Related

- `src/providers/smooth-scroll-provider.tsx` — scroll loop + ScrollTrigger sync
- `src/lib/design-system/animations.ts` — existing Framer Motion variants (coexist, don't overlap)
- `docs/repository-discovery/PRD-gsap-animations.md` — full motion PRD
