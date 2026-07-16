# `src/lib/database` — Schema helpers & privileged client

**Layer:** Infrastructure (data adapter)
**May import:** `@supabase/*`, `config/env`, generated types
**Must NOT:** hold business logic or be exposed to the browser.

## What this folder is for

Database-facing helpers that sit under the services layer: the schema/type surface and the privileged (service-role) client used for trusted server operations.

## What lives here

- **`types.generated.ts`** — Supabase-shaped `Database` type: the full public enum set + `Row`/`Insert`/`Update` for the actively-used commerce tables, transcribed from the migrations. Also exports the `Tables<>`, `TablesInsert<>`, `TablesUpdate<>`, `Enums<>` helper generics. **Regenerate** with `npm run db:types` (remote) or `npm run db:types:local` (local stack) to get the complete, authoritative schema — that command overwrites this file.
- **`schema.ts`** — re-exports the generated types, the complete `CommerceTable` name union, and `adminPermissions` (RBAC permission constants).
- **`admin.ts`** — the service-role Supabase client that **bypasses RLS**. Server-only, for webhooks/admin/back-office tasks.

> The current `types.generated.ts` is a hand-maintained baseline (accurate as of migration 000009) so column-level types exist today; run `npm run db:types` once the Supabase CLI + `SUPABASE_PROJECT_ID` are available to replace it with the full generated set and then type clients as `SupabaseClient<Database>`.

## How to add something new

1. **New table/column in use:** update migrations under `supabase/migrations/`, then regenerate types (`npm run db:types`) and reference them via `Tables<"...">` — don't hand-type row shapes elsewhere. (If the CLI isn't available, mirror the migration into `types.generated.ts` following the existing table blocks, keeping the baseline accurate.)
2. **New privileged operation:** use the `admin.ts` client inside a `services/*` function; never import it into client components.
3. Keep query composition in services; this folder provides the typed client + shapes.

## Rules & boundaries

- Service-role client is a loaded gun: server-side only, never shipped to the browser, used only when RLS must be intentionally bypassed.
- Types should originate from the schema, not be duplicated by hand.

## Related

- `src/lib/supabase/*` — RLS-respecting clients
- `supabase/migrations/*` — source of truth for schema
- `docs/repository-discovery/10-database.md`
