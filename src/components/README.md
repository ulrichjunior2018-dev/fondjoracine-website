# `src/components` — Shared UI (Presentation)

**Layer:** Presentation (reusable/presentational)
**May import:** other `components/*`, `lib/utils`, `hooks/*`, design tokens
**Must NOT:** own data access (no Supabase/services calls) or business rules. Data comes in via props.

## What this folder is for

Cross-feature, presentational building blocks. If a component is specific to one feature (e.g. the elixir storefront), it belongs in `src/features/<feature>/components` instead — put things here only when they are genuinely shared or brand-level.

## What lives here

- **`ui/`** — the design-system primitives: `button`, `card`, `input`, `modal`, `tabs`, `accordion`, `table`, `badge`, `toast`, `typography`, `container`, `grid`, `pagination`, `breadcrumb`, plus brand pieces (`GoldLine`, `Eyebrow`, `magnetic-button`, `text-reveal`, `custom-cursor`, `micro-interactions`, language switch widgets).
- **`three/`** — R3F / Three.js scenes and their fallbacks (`RootLineScene`, `RootLineFallback`, `SceneGate`, `use-root-line-progress`).
- **`feedback/`** — `empty-state`, `error-state`, `page-loading-state`.
- **`seo/`** — `document-language`.
- **`icons/`** — SVG icon set.
- **Brand/marketing shells (root):** `CinematicHero`, `HeroVideoBackground`, `WebGLHeroEnhancement`, `MaisonFondjoWebGLScene`, `HairTexturePanels`, `AdvisorShell`, `AdvisorRouteSections`, `FloatingWhatsApp`, `DiagnosticQuiz`.

## How to add something new

**A UI primitive:** add to `ui/`. Style with Tailwind v4 + tokens from `src/styles/globals.css`; follow the variant pattern of existing primitives (e.g. `button.tsx`). Keep it stateless where possible; accept `className` and forward refs.

**A 3D/WebGL piece:** add to `three/`, and always ship a non-WebGL fallback + gate it behind `SceneGate` and reduced-motion checks.

**A feedback/empty/error view:** add to `feedback/`.

## Rules & boundaries

- Presentational only — take data/handlers as props.
- Respect `prefers-reduced-motion` for any animation/3D.
- Reuse tokens; don't hardcode brand colors/spacing.

## Related

- `src/features/*/components` — feature-specific UI
- `src/styles/globals.css` — tokens & Tailwind theme
- `src/hooks/*` — shared client hooks
