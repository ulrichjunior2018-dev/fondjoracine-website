# 01 — Project Structure

## Package model

Single npm package (not a monorepo). Package manager: **npm** (`package-lock.json`). Engine strictness via `.npmrc` (`engine-strict=true`).

## Folder tree (major)

```
fondjoracine-website/
├── .husky/                      # Git hooks (pre-commit → lint-staged)
├── docs/
│   ├── ARCHITECTURE.md          # Existing layer rules
│   └── repository-discovery/    # This audit
├── lib/                         # Root re-export → src/lib/design-tokens
├── public/
│   ├── audio/                   # Ambient audio
│   └── images/                  # Brand/product assets (+ _archive)
├── scripts/
│   └── diagnose.mjs             # Prebuild image/key checks
├── src/                         # Application source
│   ├── app/                     # Next.js App Router (pages + API)
│   ├── components/              # Shared UI / marketing / 3D / feedback
│   ├── config/                  # Validated env + site config
│   ├── content/                 # Copy, advisor copy, formula
│   ├── domain/                  # Framework-free types/schemas
│   ├── features/                # Feature modules (elixir, commerce, admin, home)
│   ├── hooks/                   # Client hooks
│   ├── i18n/                    # Dictionaries (en, fr, es)
│   ├── lib/                     # Infrastructure adapters
│   ├── providers/               # App providers (theme, i18n, Lenis, toast)
│   ├── services/                # Application services / repos
│   ├── state/                   # Context helpers
│   └── styles/                  # globals.css (Tailwind v4 + tokens)
├── styles/                      # Shim → src/styles/globals.css
├── supabase/migrations/         # SQL schema migrations (000001–000009)
├── next.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── .env.example
```

## Folder responsibilities

### `src/app/`

| Aspect              | Detail                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Purpose**         | Routes, layouts, metadata routes, API Route Handlers                                                                |
| **Responsibility**  | HTTP/UI entry; compose features; no heavy business logic                                                            |
| **Important files** | `layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts`, `api/**/route.ts` |
| **Relationships**   | Imports `features/*`, `components/*`, `services/*`, `lib/*`                                                         |

### `src/components/`

| Aspect                | Detail                                                   |
| --------------------- | -------------------------------------------------------- |
| **Purpose**           | Shared presentational UI and marketing shells            |
| **Responsibility**    | Reusable primitives; advisor shell; heroes; 3D; feedback |
| **Important folders** | `ui/`, `three/`, `feedback/`, `seo/`                     |
| **Relationships**     | Used by `app/` and `features/`; must not own data access |

### `src/features/`

| Feature     | Purpose                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `elixir/`   | One-product premium storefront, CMS content, order UI (partially orphaned) |
| `commerce/` | Legacy cart/shop/wishlist/review UI + server helpers                       |
| `admin/`    | Admin dashboard and orders table                                           |
| `home/`     | Reveal animations, newsletter form, hero media                             |

### `src/domain/`

Framework-independent entities and Zod schemas (`auth`, `catalog`, `commerce`, `customer`, `order`, `shared`). Must not import Next/Supabase per `docs/ARCHITECTURE.md`.

### `src/services/`

Application operations: commerce (orders, cart, CMS admin, consultations), older repository stubs under `auth/`, `catalog/`, `customer/`, `order/`.

### `src/lib/`

Adapters and utilities: Supabase clients, Stripe, Resend, Cloudinary, auth/RBAC, API helpers, SEO, rate limiting, design tokens, logging, errors.

### `src/config/`

`env.ts` (Zod-parsed env), `site.ts`, `product-pricing.ts`. **Only** place that should read `process.env` (architectural rule).

### `src/content/` / `src/i18n/`

Static marketing copy and formula; locale dictionaries.

### `supabase/migrations/`

Authoritative SQL schema evolution (9 files).

### `public/`

Static images and audio served as-is.

### Root shims

- `lib/` and `styles/` re-export into `src/` (convenience, not packages).

## Path aliases

From `tsconfig.json`: `@/*` → `./src/*`, plus explicit aliases for `app`, `components`, `config`, `domain`, `features`, `hooks`, `lib`, `providers`, `services`, `state`, `styles`.

## Absences (confirmed)

| Item                           | Status                                  |
| ------------------------------ | --------------------------------------- |
| `middleware.ts`                | **Not present**                         |
| `tailwind.config.*`            | **Not present** (Tailwind v4 CSS-first) |
| `components.json` (shadcn CLI) | **Not present**                         |
| Monorepo tooling               | **Not present**                         |
| `supabase/functions/`          | **Not present**                         |
| `supabase/config.toml`         | **Not present**                         |
