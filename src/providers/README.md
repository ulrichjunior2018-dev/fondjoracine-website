# `src/providers` — App-wide React providers

**Layer:** Presentation (composition root for client context)
**May import:** React, `lib/*`, `hooks/*`, third-party providers
**Must NOT:** hold business logic or data access.

## What this folder is for

The client-side context/providers that wrap the app (mounted high in `src/app/layout.tsx`). This is where global concerns like theming, i18n, smooth scrolling, and toasts are set up once.

## What lives here

- **`app-providers.tsx`** — the single composition that nests all providers; imported by the root layout.
- **`smooth-scroll-provider.tsx`** — Lenis smooth-scroll + motion-layer boot. Owns the single scroll loop: registers GSAP/ScrollTrigger, drives `lenis.raf` via `gsap.ticker`, and syncs ScrollTrigger on Lenis scroll. Keeps the existing disable conditions (coarse pointer / reduced-motion / constrained network); when disabled, ScrollTrigger falls back to native scroll. SSR-safe.

## How to add something new

1. Create `src/providers/<thing>-provider.tsx` as a `"use client"` component that renders `children`.
2. Add it into the nesting inside `app-providers.tsx` (mind ordering — providers that depend on others go inside them).
3. Keep provider state minimal; heavy/shared logic belongs in `hooks/*` or `lib/*`.
4. Guard browser-only libraries (like Lenis) behind mounted/`prefers-reduced-motion` checks.

## Rules & boundaries

- One place to register global context: `app-providers.tsx`.
- No fetching business data here — providers wire cross-cutting UX, not domain state.

## Related

- `src/app/layout.tsx` — mounts `app-providers`
- `src/hooks/*` — client logic used by providers
