# PRD — GSAP Animation Layer for Maison Fondjo (Sève Racine)

**Status:** Draft for approval
**Type:** Feature / Enhancement (additive, non-breaking)
**Owner:** Engineering + Brand
**Related:** A separate PRD will cover architecture & codebase future-readiness. This PRD is scoped **only** to the motion/animation layer and its brand grounding.

---

## 1. Objective

Introduce a cohesive, brand-aligned **GSAP** animation layer to the Maison Fondjo storefront to elevate the luxury feel and storytelling of Sève Racine, **without** changing the technology stack (beyond adding GSAP itself), the color palette, typography, copy meaning, or anything that could break the live site.

Motion should reinforce the brand idea — _"Enracinée dans la nature. Faite pour durer."_ (Rooted in nature. Made to last.) — through organic, root-and-growth-inspired movement that feels editorial and premium, never gimmicky.

---

## 2. Hard Constraints (non-negotiable)

These are guardrails. Any change that violates them is out of scope for this PRD.

| #   | Constraint                                | Detail                                                                                                                                                                       |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | **No tech-stack changes**                 | Keep Next.js 16, React 19, Tailwind v4, Supabase, Framer Motion, Lenis, Three.js. GSAP is **added**, nothing is removed or replaced.                                         |
| C2  | **No color palette changes**              | Do not alter brand tokens in `src/styles/globals.css` (`--fr-gold`, `--obsidian`, `--fr-*`, semantic aliases). Animations may reveal/opacity/transform existing colors only. |
| C3  | **No typography or copy meaning changes** | Fonts (Fraunces etc.) and text content stay as-is. Motion may split/stagger text but must not change wording.                                                                |
| C4  | **No breaking the live site**             | No route changes, no data-flow changes, no server-component conversions to client that alter behavior. Purely presentational, progressively enhanced.                        |
| C5  | **Respect existing motion system**        | GSAP must coexist with Framer Motion and Lenis, not fight them (see §7).                                                                                                     |
| C6  | **Accessibility first**                   | Full `prefers-reduced-motion` compliance; content must be fully usable with zero animation.                                                                                  |
| C7  | **Brand claims safety**                   | Any animated copy must preserve the verified, non-medical claims language in §4. No animation may imply cure/regrowth/disease treatment.                                     |

---

## 3. Current Motion Baseline (as-is, verified)

| Concern               | Current implementation                                              | File                                               |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| Smooth scroll         | Lenis, self-managed `requestAnimationFrame` loop                    | `src/providers/smooth-scroll-provider.tsx`         |
| Disable conditions    | Coarse pointer, reduced-motion, or slow network (`saveData`, 2g/3g) | same                                               |
| Reveal / micro-motion | Framer Motion variants (`fadeIn`, `riseIn`, `scaleIn`)              | `src/lib/design-system/animations.ts`              |
| Scroll progress       | `useScroll` / `useTransform` hooks                                  | `src/hooks/useScrollProgress.ts`, `useParallax.ts` |
| Text reveal           | `useInView` word/char reveal                                        | `src/components/ui/text-reveal.tsx`                |
| 3D                    | Three.js / R3F gated behind `SceneGate`                             | `src/components/three/*`                           |
| CSS keyframes         | `fondjoFadeUp`, press states                                        | `src/styles/globals.css`                           |

**Key fact:** Lenis is **not** currently synced with any GSAP ScrollTrigger (GSAP does not exist yet). This PRD introduces that integration carefully (§7).

GSAP is **not** currently a dependency (only referenced inside `.claude/skills/**` data files, which are unrelated tooling).

---

## 4. Brand & Product Reference (Verified — canonical source of truth)

This section is the authoritative brand/product context that all animated storytelling must respect. **Do not alter these facts without a corresponding label / DPML / regulatory update.**

### 4.1 The Story

Maison Fondjo was born from a belief: **healthy hair starts with a healthy scalp.** Rather than temporary cosmetic fixes, Sève Racine supports long-term scalp and hair health. Founders **Fondjo Ulrich** and **Fondjo Clarisse** researched botanical oils valued for generations in Cameroon and beyond, combining **eleven** carefully selected botanicals into one balanced formulation, **pressed in Buea, Cameroon.**

Brand tagline: **"Enracinée dans la nature. Faite pour durer."**

Vision: continue developing high-quality botanical hair care people can trust, and make real hair care accessible across Cameroon and beyond.

### 4.2 Biological framing (approved language)

Healthy hair begins at the **hair follicle**; during the **anagen (growth) phase**, follicle cells divide to produce new hair fibers. Healthy growth depends on a balanced scalp environment, circulation, moisture, healthy sebum, and nutrients. Sève Racine's eleven botanical oils work together to **nourish the scalp, condition the hair shaft, and reduce moisture loss**, improving softness, manageability, and elasticity while reducing breakage.

### 4.3 Key botanical oils (hero ingredients for storytelling)

| Oil                                              | Approved benefit language                                                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Moringa** (_Moringa oleifera_)                 | Rich in vitamins & antioxidants; nourishes scalp, supports the hair's protective layer, improves strand condition |
| **Graine Noire / Black Seed** (_Nigella sativa_) | Replenishes moisture, conditions dry/damaged hair, supports a healthier-looking scalp                             |
| **Ricin / Castor Oil** (_Ricinus communis_)      | Rich fatty-acid profile; supports nourishment, moisture retention, softness                                       |

### 4.4 Core Formula — 11 Botanical Ingredients (verified, matches live label)

1. Menthe (_Mentha_)
2. Moringa (_Moringa oleifera_)
3. Graine noire / Nigelle (_Nigella sativa_)
4. Laurier / Bay Leaf (_Laurus nobilis_)
5. Ricin / Castor Oil (_Ricinus communis_)
6. Coco / Coconut Oil (_Cocos nucifera_)
7. Olive Oil (_Olea europaea_)
8. Amande douce / Sweet Almond (_Prunus amygdalus dulcis_)
9. Avocat / Avocado Oil (_Persea americana_)
10. Argan Oil (_Argania spinosa_)
11. Jojoba Oil (_Simmondsia chinensis_)

> **Note:** Final label concentration order is pending formulator confirmation — **do not present this list as a concentration ranking** in any animated sequence (e.g., no "ranked by potency" reveal).

### 4.5 How to Use (for ritual/step animations)

Apply a moderate amount to scalp and hair → focus on thinning/dry/damaged areas → massage gently with fingertips **3–5 minutes** → leave on several hours or overnight → wash per normal routine if desired. **Best results: 2–4 times/week, consistently.**

### 4.6 Precautions (must remain legible; never obscured by motion)

Do not apply to broken/infected/irritated skin • avoid excessive heat styling immediately after • apply to clean scalp when possible • store cool/dry, away from sunlight • keep out of reach of children.

### 4.7 Consultation questions (for diagnostic motion flow)

1. Main hair concern (thinning, breakage, dryness, slow growth, or hair loss)?
2. Recent chemical treatments, colour, relaxers, or heat styling?
3. Scalp description (dry, oily, itchy, flaky, or sensitive)?
4. Wash & moisturize frequency?
5. Any medication or medical condition affecting hair/scalp?

---

## 5. Animation Design Principles (brand-driven)

1. **Rooted & organic** — motion should evoke roots spreading, sap rising, botanicals unfurling. Favor eased, natural curves over mechanical linear motion.
2. **Editorial luxury** — slow, confident reveals; generous timing; nothing bouncy or playful that cheapens the brand.
3. **Purposeful, not decorative** — every animation supports comprehension or hierarchy (guide the eye to product, story, ingredients, CTA).
4. **Restraint** — layer motion sparingly; the palette, typography, and photography carry the brand. Motion is the finishing polish.
5. **Continuity with existing feel** — match the current dark, obsidian-and-gold, slow-reveal aesthetic already established with Framer Motion.
6. **Performance-respecting** — animate only `transform` and `opacity` where possible; avoid layout thrash.

### Suggested easing/timing vocabulary (using existing token durations where available)

- Reveals: 0.6–1.2s, custom cubic ease (organic ease-out).
- Scroll-scrubbed sequences: tied to scroll position, not fixed duration.
- Stagger: 0.06–0.12s between siblings (e.g., ingredient list, nav items).

---

## 6. Scope — Where GSAP Applies

GSAP is layered onto **existing** live sections only. No new routes.

| Priority | Surface                           | File(s)                                                          | Proposed motion                                                                                    |
| -------- | --------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| P0       | Homepage hero                     | `src/components/CinematicHero.tsx`, `HeroVideoBackground.tsx`    | Scroll-scrubbed hero parallax; "sap rising" gold accent line; headline word reveal (preserve copy) |
| P0       | Premium storefront sections       | `src/features/elixir/components/premium-storefront-page.tsx`     | ScrollTrigger section reveals, pinned product moment, ingredient stagger, founder-story fade       |
| P1       | Ingredient showcase               | `ingredient-gallery.tsx`, `AdvisorRouteSections.tsx` (Botanique) | Staggered botanical cards unfurling; hover micro-motion on the 11 oils                             |
| P1       | Advisor shell + routes            | `src/components/AdvisorShell.tsx`, `AdvisorRouteSections.tsx`    | Section entrance transitions; sticky nav underline motion                                          |
| P1       | Diagnostic quiz                   | `src/components/DiagnosticQuiz.tsx`                              | Step-to-step transitions, progress "root growth" indicator, result reveal                          |
| P2       | Product 3D / compare              | `product-3d-scene.tsx`, `image-compare-slider.tsx`               | Scrub-driven reveal to complement (not replace) existing R3F                                       |
| P2       | Guarantee / ritual / testimonials | `guarantee-section.tsx`, ritual/how-to sections                  | Number count-ups, step-by-step ritual reveal (matches §4.5)                                        |

> Sections currently **orphaned/unmounted** (e.g., `OrderFlow`, `HairConsultationAgent`, `NewsletterForm`, `features/commerce/*`) are **out of scope** here — animating dead UI has no live value. They may be covered by the separate architecture PRD if/when remounted.

---

## 7. Technical Integration Requirements

### 7.1 Dependency

- Add `gsap` (official, includes ScrollTrigger, ScrollTo, Flip, Text utilities in the standard package). Pin an explicit version via the package manager (do not hand-edit lockfile). GSAP is MIT-licensed for standard plugins used here.
- Optionally add `@gsap/react` for the `useGSAP()` hook (SSR-safe, auto-cleanup). Recommended.

### 7.2 SSR & React 19 safety

- All GSAP code runs **client-side only** (`"use client"` modules or inside effects). Never import GSAP into a Server Component's render path.
- Use `useGSAP()` (or `gsap.context()` + cleanup) so animations are **scoped and reverted on unmount** — mandatory to avoid leaks and double-registration under React strict mode.
- Register plugins once (e.g., `gsap.registerPlugin(ScrollTrigger)`), guarded so it runs a single time on the client.

### 7.3 Lenis ↔ ScrollTrigger synchronization (critical)

Because Lenis manages its own RAF scroll, ScrollTrigger must be driven by Lenis when Lenis is active:

- On Lenis `scroll` event → call `ScrollTrigger.update()`.
- Drive both from a **single** RAF loop (either Lenis's or GSAP's ticker), not two competing loops.
- **When Lenis is disabled** (coarse pointer / reduced-motion / slow network — see `smooth-scroll-provider.tsx`), ScrollTrigger must fall back to **native scroll** and still work correctly.
- Preferred approach: centralize this in a small motion provider or extend the existing smooth-scroll provider so there is **one source of truth** for the scroll loop. Must not change Lenis's existing disable conditions.

### 7.4 Reduced motion & progressive enhancement

- Wrap all non-essential GSAP in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` query; provide a reduced/no-motion branch that sets final states instantly.
- Content, layout, and CTAs must be fully visible and functional with JavaScript-driven motion disabled (no "invisible until animated" traps — set safe initial states or reveal on load fallback).

### 7.5 Coexistence with Framer Motion

- **Do not** animate the same property on the same element with both libraries. Assign ownership per component: keep existing Framer Motion reveals as-is unless a section is explicitly migrated; use GSAP for new scroll-scrubbed/pinned/timeline sequences Framer Motion doesn't handle as cleanly.
- Prefer GSAP for: ScrollTrigger pinning, scrubbed timelines, complex staggered sequences, SVG path/line drawing (roots, sap line).
- Keep Framer Motion for: existing component-level enter/exit and simple `whileInView` reveals already shipped.

### 7.6 Performance budget

- Animate `transform`/`opacity` only where feasible; avoid animating layout properties (width/height/top/left) on scroll.
- Use `will-change` sparingly and remove after animation.
- No animation may cause CLS (cumulative layout shift) on initial load.
- Target: no measurable regression in Lighthouse Performance vs. current baseline; maintain 60fps on mid-tier mobile for any motion that runs there.
- Kill/scope ScrollTriggers on route change to prevent accumulation.

### 7.7 Code organization (follow existing conventions)

- New reusable motion helpers under a dedicated module (e.g., `src/lib/motion/` or extend `src/lib/design-system/`), matching existing naming (kebab-case files, camelCase exports).
- Register GSAP plugins in one client entry (e.g., a `MotionProvider` mounted inside `AppProviders`), preserving current provider order.
- Keep per-section animation logic colocated with its component via `useGSAP` scoped refs.

---

## 8. Accessibility Requirements

- Full `prefers-reduced-motion: reduce` support (no parallax, no scrub, no autoplay motion — instant final states).
- No motion that flashes > 3x/second.
- Focus order and keyboard navigation unaffected by pinned/scrubbed sections.
- Precautions and legal/policy text (§4.6) must never be hidden behind incomplete animation states.
- Diagnostic quiz remains fully operable if motion is disabled.

---

## 9. Phased Delivery Plan

| Phase                                           | Deliverable                                                                                                                | Exit criteria                                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **0 — Foundation**                              | Add `gsap` (+ `@gsap/react`), create `MotionProvider`, wire Lenis↔ScrollTrigger sync, `matchMedia` reduced-motion scaffold | Site behaves identically to today with motion disabled; no console errors; Lenis disable conditions unchanged |
| **1 — Hero + Storefront (P0)**                  | CinematicHero scrub + storefront section reveals + gold "sap" line                                                         | 60fps desktop; no CLS; reduced-motion fallback verified                                                       |
| **2 — Ingredients + Advisor + Diagnostic (P1)** | 11-botanical stagger, advisor transitions, quiz step motion                                                                | Copy/claims unchanged; a11y pass                                                                              |
| **3 — 3D/compare + ritual/testimonials (P2)**   | Complementary scrub reveals, count-ups, ritual steps                                                                       | No conflict with existing R3F/Framer Motion                                                                   |
| **4 — Polish & QA**                             | Cross-device/browser QA, perf audit, reduced-motion audit                                                                  | Meets §11 acceptance criteria                                                                                 |

Each phase is independently shippable and behind graceful fallbacks.

---

## 10. Testing & QA Matrix

- **Devices:** desktop (mouse), tablet, mobile (touch/coarse pointer).
- **Conditions:** Lenis on vs. Lenis disabled (coarse pointer, reduced-motion, throttled 3g/saveData).
- **Browsers:** Chromium, Firefox, Safari (incl. iOS Safari).
- **Regression:** verify all live routes render, redirects intact, admin/order-confirmation unaffected, no hydration warnings.
- **Perf:** Lighthouse before/after; frame profiling on scrubbed sections.
- **A11y:** reduced-motion, keyboard, screen-reader read-through of animated text.

---

## 11. Acceptance Criteria

1. GSAP added additively; no existing dependency removed; palette, fonts, and copy meaning unchanged.
2. All live routes and flows behave exactly as before when motion is disabled.
3. Lenis and ScrollTrigger share a single scroll loop; no jitter, double-scroll, or scroll hijack regressions.
4. `prefers-reduced-motion` fully honored; content usable with zero motion.
5. No CLS introduced on load; no measurable Lighthouse Performance regression.
6. No memory leaks: all GSAP contexts/ScrollTriggers cleaned up on unmount/route change.
7. Verified brand/product facts (§4) and claims-safety (C7) preserved in any animated copy.
8. Orphaned/unmounted components are not animated under this PRD.

---

## 12. Risks & Mitigations

| Risk                                         | Impact                           | Mitigation                                                                            |
| -------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Lenis + ScrollTrigger conflict               | Broken/janky scroll on live site | Single RAF loop; QA with Lenis on/off; ship Phase 0 gated                             |
| Double-animating with Framer Motion          | Visual glitches                  | Strict per-element ownership; no overlap                                              |
| Reduced-motion not fully covered             | A11y regression                  | `gsap.matchMedia` mandatory; audit in every phase                                     |
| Motion hides content (initial hidden states) | Broken UX / SEO                  | Safe initial states + load fallback; content visible without JS motion                |
| Bundle size / perf on mobile                 | Slower loads                     | Import only needed plugins; lazy-init heavy sequences; reuse Lenis disable heuristics |
| Scope creep into architecture refactor       | Delivery risk                    | Architecture concerns deferred to the separate PRD                                    |

---

## 13. Out of Scope (covered by the separate Architecture PRD)

- Type-safety / generated Supabase types, service refactors, transactions, rate-limiting durability.
- Content/i18n consolidation, locale routing, token-drift cleanup.
- Reviving or removing orphaned modules (`OrderFlow`, `HairConsultationAgent`, `NewsletterForm`, `features/commerce/*`).
- Any color, typography, or copy redesign.

---

## 13.1 Implementation Log

**Phase 0 — Foundation: ✅ done** (additive, verified `typecheck` + `lint` = 0 errors).

- Added `gsap` + `@gsap/react` (Open Question #1 resolved: standard plugins only — `ScrollTrigger`; no Club/SplitText).
- Central GSAP entry `src/lib/motion/gsap.ts`: `registerGsap()` (idempotent, client-only), `prefersReducedMotion()` (SSR-safe), re-exports `gsap`/`ScrollTrigger`.
- **Scroll-loop unification (Open Question #2 resolved):** kept it in `smooth-scroll-provider.tsx` rather than a separate `MotionProvider`. Reason: Lenis is created inside an effect, so a cross-provider handoff needed `setState`-in-effect, which this repo's `react-hooks` lint rule forbids; one provider owning Lenis + GSAP in a single effect is cleaner and truly single-source. It registers GSAP, drives `lenis.raf` via `gsap.ticker` (`lagSmoothing(0)`), and calls `ScrollTrigger.update()` on Lenis scroll. Lenis disable conditions are unchanged; disabled → native-scroll ScrollTrigger fallback.
- Exit criteria met: no ScrollTrigger animations registered yet, so scroll behaves exactly as before; no console/type/lint errors.

**Phase 1 — Hero + Storefront (P0): in progress.**

Resolved brand decisions (Phase 1):

- **#3 Signature moment:** gold "sap" accent line in the hero (editorial, rooted-in-nature motif).
- **#4 Mobile motion:** **yes — motion on mobile.** Lenis stays disabled on coarse pointers; ScrollTrigger uses **native scroll**. Mobile gets **lighter** GSAP (shorter distances, `once` reveals, soft scrub only where cheap); desktop can use richer scrub/parallax.

---

## 14. Open Questions

1. Confirm GSAP standard plugins are sufficient (no Club/premium plugins like SplitText required), or approve `@gsap/react`. ✅ resolved in §13.1 (standard + `@gsap/react`).
2. Should Phase 0's scroll-loop unification live in the existing `smooth-scroll-provider.tsx` or a new `MotionProvider`? ✅ resolved — consolidated into `smooth-scroll-provider.tsx`.
3. Which single "signature" moment should anchor the hero? ✅ gold sap accent line (Phase 1 default).
4. Confirm mobile motion appetite? ✅ **motion on mobile** (lighter GSAP on native scroll).
