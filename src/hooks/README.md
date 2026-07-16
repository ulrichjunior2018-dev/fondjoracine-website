# `src/hooks` — Shared client hooks

**Layer:** Presentation (client-side logic)
**May import:** React, `lib/*` (browser-safe), other hooks
**Must NOT:** contain server-only code or data-access logic.

## What this folder is for

Reusable client-side React hooks shared across features/components. Feature-specific hooks can live inside their feature; put a hook here when more than one feature needs it.

## What lives here

- **`use-mounted.ts`** — SSR-safe mounted flag (guard client-only rendering / avoid hydration mismatches).
- **`useScrollProgress.ts`** — normalized scroll progress for scroll-driven UI.
- **`useParallax.ts`** — parallax transform helper for motion sections.

## How to add something new

1. Create `useThing.ts` (or `use-thing.ts` — match the file's neighbors) exporting a single hook.
2. Mark the consuming component `"use client"`; hooks here are browser-side.
3. Guard anything touching `window`/`document` behind a mounted check (`use-mounted`) for SSR safety.
4. Respect `prefers-reduced-motion` for motion-related hooks.

## Rules & boundaries

- Pure client concerns only; no `fetch`-to-DB or secrets.
- Keep hooks focused and composable.

## Related

- `src/components/*`, `src/features/*` — hook consumers
- `src/providers/*` — app-wide context providers
