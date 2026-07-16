# `src/features` — Feature modules (Presentation + feature logic)

**Layer:** Presentation, organized by business capability
**May import:** `components/*`, `services/*`, `domain/*`, `lib/*`, `config/*`, `hooks/*`, `i18n/*`
**Must NOT:** be imported _by_ `lib/` or `domain/` (dependency points inward, not out).

## What this folder is for

Self-contained slices of the product. Each feature owns its UI components, feature-local data/content, and small feature helpers. Pages in `src/app` compose features; features should stay decoupled from each other.

## The features

- **`elixir/`** — the flagship Sève Racine one-product storefront: premium storefront page, product gallery/3D, CMS-editable sections, order flow, checkout button, hair-consultation agent, WhatsApp CTA. Content lives in `elixir/data`, CMS helpers in `elixir/lib`. See `elixir/README.md`.
- **`commerce/`** — legacy/generic shop UI: product grid/card/actions, cart view, wishlist view, review form, shop filters, plus `lib/server.ts` and `lib/format.ts`. Some of this is partially wired.
- **`admin/`** — admin dashboard, orders table, locked state.
- **`home/`** — homepage building blocks: reveal animations, newsletter form, hero media, and `data/homepage-content.ts`.
- **`account/`** — customer-facing auth (login/signup/password reset) and the "My Account" dashboard (orders, profile, addresses, security, notifications). See `account/README.md`.

## How to add a new feature

1. Create `src/features/<feature>/` with `components/`, and `data/` and/or `lib/` as needed.
2. Keep business/data operations in `src/services/*`; the feature calls those, it doesn't talk to Supabase directly.
3. Validate inputs with schemas from `src/domain/*`.
4. Expose the feature by importing its components into a `src/app/**/page.tsx`.
5. Don't reach into another feature's internals — share via `components/`, `services/`, or `domain/`.

## Rules & boundaries

- One feature should not import another feature's private components.
- Feature-local content that is editorial goes in `data/`; multilingual UI strings go in `src/i18n`.

## Related

- `src/app/*` — mounts features into routes
- `src/services/*` — feature data/business operations
- `src/components/*` — shared primitives
