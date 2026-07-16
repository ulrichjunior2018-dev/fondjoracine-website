# `src/domain` — Framework-free types & schemas (Domain)

**Layer:** Domain (core, foundational)
**May import:** `zod` only.
**Must NOT:** import Next.js, Supabase, React, or anything in `app/`, `features/`, `lib/`, `services/`. This layer has zero framework/infrastructure dependencies.

## What this folder is for

The shared vocabulary of the business: entity types and Zod validation schemas. Everything else (API, services, UI, SDK) depends on these, so they must stay pure and stable. Because they're framework-free, the same types can be reused by a future mobile app or external SDK.

## What lives here (bounded contexts)

- **`shared/`** — `entity.ts` base types.
- **`auth/`** — auth/session/role types.
- **`catalog/`** — product/catalog types.
- **`commerce/`** — `types.ts` + `schemas.ts` (orders, payment methods, product summaries/details, admin inputs). Most commerce validation originates here.
- **`customer/`** — `types.ts` (account, address, order-summary, notification-preference types) + `schemas.ts` (signup/login/profile/address/notification validation) for the customer account surface.
- **`order/`** — order entity types.

## How to add something new

1. Pick (or create) the correct bounded-context subfolder.
2. Add the entity `type` in `types.ts` and, if it crosses a boundary (form input, API body, query params), a Zod schema in `schemas.ts`.
3. Derive TS types from schemas with `z.infer` so validation and types can't drift.
4. Import these schemas at API boundaries and in services — don't redefine shapes elsewhere.

## Rules & boundaries

- Keep it pure: no I/O, no env, no framework imports.
- One concept = one home. If two contexts need it, put it in `shared/`.

## Related

- `src/services/*` — consume these types/schemas to do work
- `src/app/api/*` — validate requests with these schemas
- `docs/ARCHITECTURE.md` — layer dependency rules
