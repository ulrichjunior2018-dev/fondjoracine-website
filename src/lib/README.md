# `src/lib` — Infrastructure adapters & utilities

**Layer:** Infrastructure
**May import:** `domain/*`, `config/*`, third-party SDKs, other `lib/*`
**Must NOT:** import `features/*` or `app/*` (that would invert the dependency direction). Keep `lib` consumable by anything.

## What this folder is for

The technical plumbing that talks to the outside world (databases, payment/email/image vendors) and the small cross-cutting utilities everything reuses. Business rules do **not** live here — they live in `services/*`. `lib` gives services clean, typed tools.

## What lives here

- **`supabase/`** — server & browser Supabase clients. See `supabase/README.md`.
- **`database/`** — DB schema helpers / admin client. See `database/README.md`.
- **`api/`** — HTTP envelope (`responses.ts`) + request parsing (`request.ts`) for route handlers.
- **`api-client/`** — the typed consumer SDK for `/api/v{n}`. See `api-client/README.md`.
- **`payments/`** — payment provider abstraction + registry. See `payments/README.md`.
- **`auth/`** — `session.ts` and `rbac.ts` (role checks).
- **`email/`** — `resend.ts` (transactional email).
- **`cloudinary/`** — image delivery client.
- **`seo/`** — metadata builders.
- **`security/`** — `rate-limit.ts`.
- **`design-system/`** + **`design-tokens.ts`** — tokens & animation presets.
- **`errors/`** — `app-error.ts` (`AppError`, the controlled error type).
- **`logger/`** — structured logging.
- **`utils/cn.ts`**, `config.ts`, `locale.ts`, `device.ts`, `site-images.ts`, `advisor-site.ts`, `i18n-context.tsx` — assorted helpers.

## How to add something new

**A new external integration (vendor):**

1. Create `src/lib/<vendor>/client.ts` that reads config from `@/config/env` and returns a configured client.
2. Expose small, purpose-built functions — don't leak the raw SDK everywhere.
3. Call it from a `services/*` function, not directly from UI.

**A new abstraction (like payments):** define an interface + a registry so callers depend on the contract, not a concrete vendor (see `payments/`).

## Rules & boundaries

- No business logic here; keep it reusable and side-effect-light.
- Only `config/*` reads `process.env`; `lib` reads config through it.
- Errors thrown to callers should be `AppError` so the API layer can decide exposure.

## Related

- `src/services/*` — the primary consumer
- `src/config/*` — where all env/config originates
