# `src/styles` — Global styles & design tokens

**Layer:** Presentation (styling foundation)
**Stack:** Tailwind CSS v4 (CSS-first — no `tailwind.config.js`).

## What this folder is for

The single global stylesheet and the source of truth for design tokens (colors, spacing, typography, radii, motion) expressed as CSS variables and Tailwind v4 `@theme`. Components consume these tokens rather than hardcoding values.

## What lives here

- **`globals.css`** — Tailwind v4 entry, `@theme` token definitions, base/reset layers, brand variables, and any global utilities. (Root `styles/` is just a shim that re-exports this.)

## How to add something new

**A new token (color/space/font):**

1. Add the CSS variable + `@theme` mapping in `globals.css`.
2. Use it via Tailwind utilities or `var(--token)`; never hardcode the literal in components.

**A new global base rule:** add it to the appropriate layer in `globals.css` (keep component-specific styling in the component).

## Rules & boundaries

- Tailwind v4 is CSS-first: configure through `globals.css`, not a JS config file.
- Keep brand palette centralized here — changing a token should cascade everywhere.
- Respect dark mode and `prefers-reduced-motion` conventions already defined here.

## Related

- `src/lib/design-system/*`, `src/lib/design-tokens.ts` — TS-side token/animation presets
- `src/components/ui/*` — primitives that consume tokens
