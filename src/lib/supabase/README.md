# `src/lib/supabase` — Supabase clients

**Layer:** Infrastructure (data adapter)
**May import:** `@supabase/*`, `config/env`
**Must NOT:** contain business logic (that's `services/*`) or be imported by `domain/*`.

## What this folder is for

Constructs correctly-configured Supabase clients for each runtime. Services receive a client from here and run queries; callers should not instantiate Supabase ad hoc elsewhere.

## What lives here

- **`server.ts`** — `createSupabaseServerClient()`: cookie-based, RLS-respecting client for server components and route handlers (uses the anon key + the user's session).
- **`browser.ts`** — browser client for client components.

> A privileged/service-role client (bypasses RLS) lives in `src/lib/database/admin.ts` — use it only in trusted server contexts (webhooks, admin ops), never from the browser.

## How to add something new

1. Need a query? Add a function in the appropriate `services/*` module and pass it a client from here — don't add query logic in this folder.
2. New runtime/edge variant? Add a small factory beside `server.ts`/`browser.ts` that reads keys from `@/config/env`.
3. Keep table/column names out of this folder; those belong to `services/*` and `domain/*`.

## Rules & boundaries

- Server client respects RLS (per-user). Reach for the admin/service-role client only when RLS must be bypassed intentionally, and only server-side.
- All keys come from `config/env` — never inline them.

## Related

- `src/lib/database/*` — schema helpers + admin client
- `src/services/*` — where queries actually live
- `supabase/migrations/*` — authoritative schema
- `docs/repository-discovery/05-supabase.md`, `06-authentication.md`
