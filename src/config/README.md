# `src/config` — Validated configuration

**Layer:** Configuration (foundational)
**May import:** `zod`, `domain/*` (types only)
**Special rule:** This is the **only** place allowed to read `process.env`.

## What this folder is for

Turn raw, untyped environment + static settings into validated, typed values the rest of the app can trust. Anything else that needs config imports from here — never from `process.env`.

## What lives here

- **`env.ts`** — Zod-parsed environment variables. Fails fast at boot if a required var is missing/malformed. Exposes a typed `env` object.
- **`site.ts`** — static site metadata (name, URLs, socials, defaults).
- **`product-pricing.ts`** — pricing constants for the product.

## How to add something new

**A new environment variable:**

1. Add it to the Zod schema in `env.ts` (mark required vs optional; add sensible defaults for dev where safe).
2. Document it in `.env.example` (name + purpose, never a real secret).
3. Consume it via `import { env } from "@/config/env"`.
4. If it's a public value, prefix `NEXT_PUBLIC_` so it's available client-side.

**A new static setting:** add to `site.ts` (or a new small module here) with an explicit type.

## Rules & boundaries

- No feature logic here — just parsed values.
- Never export raw secrets to the client; only `NEXT_PUBLIC_*` may reach the browser.
- Keep validation strict so misconfiguration surfaces at startup, not at request time.

## Related

- `.env.example` — the documented variable list
- `docs/repository-discovery/11-environment.md` — env inventory
