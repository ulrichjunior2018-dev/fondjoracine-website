# `src/app` — Routing & HTTP entry (Presentation + API)

**Layer:** Presentation (pages) + API (route handlers)
**May import:** `features/*`, `components/*`, `services/*`, `lib/*`, `config/*`, `domain/*`
**Must NOT:** hold heavy business logic. Pages compose features; API routes validate input and delegate to `services/*`.

## What this folder is for

This is the Next.js App Router. Every URL and every HTTP endpoint the site exposes lives here. Files map to routes by convention:

- `page.tsx` → a page at that path
- `layout.tsx` → shared shell/metadata for a subtree
- `error.tsx` / `not-found.tsx` → error & 404 UI
- `route.ts` under `api/**` → an HTTP endpoint
- `sitemap.ts`, `robots.ts`, `manifest.ts` → generated metadata routes

## What lives here (high level)

- **Marketing/storefront pages:** `page.tsx`, `seve-racine/`, `ingredients/`, `how-to-use/`, `origin-story/`, `faq/`, `contact/`, `policies/*`, plus FR aliases (`histoire/`, `botanique/`, `sur-mesure/`, `grossistes/`).
- **Commerce pages (legacy/partial):** `shop/`, `products/[slug]/`, `collections/`, `cart/`, `wishlist/`, `search/`, `pre-order/`.
- **Flows:** `hair-consultation/`, `order-confirmation/`, `diagnostic/`.
- **Admin:** `admin/`, `admin/orders/`.
- **Customer accounts:** `login/`, `signup/`, `forgot-password/`, `reset-password/`, `auth/callback/` (auth), `account/*` (dashboard — guarded by `account/layout.tsx`; see `src/features/account/README.md`).
- **API:** everything under `api/` (see `api/README.md`).

## How to add something new

**A new page (`/foo`):**

1. Create `src/app/foo/page.tsx`. Default-export a component.
2. Add `export const metadata` (or `generateMetadata`) — reuse helpers in `src/lib/seo/`.
3. Keep the page thin: pull UI from `features/*` or `components/*`, and data from `services/*`.
4. If it needs its own error/loading UI, add `error.tsx` / `loading.tsx` beside it.

**A new API endpoint:** see `src/app/api/README.md`. Prefer adding under `api/v1/`.

## Rules & boundaries

- No `process.env` reads here — use `src/config/env.ts`.
- No direct SQL/Supabase table logic in pages — call a service.
- Auth-gated pages/routes must check the session via `src/lib/auth/*`.

## Related

- `src/features/*` — the actual page building blocks
- `src/components/*` — shared UI primitives
- `src/services/*` — data + business operations
