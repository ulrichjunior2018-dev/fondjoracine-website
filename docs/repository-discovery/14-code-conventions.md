# 14 — Code Conventions

Conventions observed in the repository. New work should follow these existing patterns.

---

## Naming

| Area             | Convention                  | Examples                                       |
| ---------------- | --------------------------- | ---------------------------------------------- |
| Files            | kebab-case for modules      | `order-flow.tsx`, `admin-dashboard-service.ts` |
| React components | PascalCase exports          | `PremiumStorefrontPage`, `AdvisorShell`        |
| Functions        | camelCase                   | `getElixirContent`, `requireAdminPermission`   |
| Zod schemas      | camelCase + `Schema` suffix | `createOneProductOrderSchema`                  |
| Permissions      | `resource.action` strings   | `orders.read`, `content.write`                 |
| SQL              | snake_case tables/columns   | `storefront_content`, `confirmation_token`     |
| Migrations       | numbered prefix             | `000007_one_product_order_flow.sql`            |

## Folder organization

Layered architecture (`docs/ARCHITECTURE.md`):

```
app → components / features → services → domain
                    ↘ lib / config
```

- Feature UI in `src/features/<feature>/components`
- Shared primitives in `src/components`
- Domain stays framework-free
- Env only via `src/config/env.ts`

## Import ordering / aliases

- Prefer `@/` path aliases (`tsconfig` paths)
- Typical order observed: type imports → external packages → `@/` internal → relative
- Prettier: double quotes, semicolons, print width 100 (`.prettierrc.json`)

## TypeScript

- `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `noImplicitOverride`
- Next `typedRoutes: true`
- Prefer Zod inference for request payloads
- DB client types are stubbed — do not assume full generated `Database` typings exist

## Component style

- Server Components by default
- `"use client"` only when hooks/browser APIs needed
- Large client storefront compositions are acceptable in features
- UI primitives wrap Radix
- Styling: Tailwind utility classes + design tokens; `cn` for merges

## Hooks

- Shared hooks under `src/hooks/`
- Feature-local hooks colocated (e.g. three `use-root-line-progress.ts`)
- Mount detection via `useSyncExternalStore` in `use-mounted`

## Forms

- Prefer Zod schemas in `domain` shared by API and UI
- RHF used for complex multi-step forms
- Simpler forms may use controlled state or FormData

## Error handling

- Throw / catch `AppError` with codes (`UNAUTHORIZED`, `FORBIDDEN`, …)
- API routes convert to JSON error responses
- Pages use `error.tsx` / feedback components; admin uses soft `.catch(() => null)` → locked state

## Logging

- `src/lib/logger` used for server-side logs (pattern present; prefer over ad-hoc `console` in services when already used)

## API organization

- One folder per resource under `src/app/api`
- Validate with Zod before service calls
- Rate-limit sensitive public POSTs

## Tooling / quality gates

- Husky pre-commit → lint-staged (Prettier + ESLint `--fix`)
- Scripts: `lint`, `typecheck`, `format`, `verify`
- ESLint: Next core-web-vitals + typescript + security plugin

## Content safety

- Product copy centralized (`src/content/formula.ts`, CMS); avoid medical claims (README)

## Recommended stance

Match neighboring files in the same feature. Prefer extending `services/commerce/*` and domain schemas over introducing a parallel backend style. Do not invent a second state library without team consensus (none exists today).
