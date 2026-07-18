# `src/lib` — Infrastructure adapters, utilities & **capability registries**

**Layer:** Infrastructure  
**May import:** `domain/*`, `config/*`, third-party SDKs, other `lib/*`  
**Must NOT:** import `features/*` or `app/*`.

## What this folder is for

Technical plumbing (databases, vendors) **and** extensibility registries so the
product can add/remove/update payments, identity, notifications, shipping,
media, and order-status presentation **without rewriting features**.

Canonical guide: [`docs/EXTENSIBILITY.md`](../../docs/EXTENSIBILITY.md).

## Registries (add a module + one registry line)

| Capability         | Path             |
| ------------------ | ---------------- |
| Payments           | `payments/`      |
| Identity / sign-in | `identity/`      |
| Notifications      | `notifications/` |
| Shipping zones     | `shipping/`      |
| Order status UI    | `order-status/`  |
| Media backends     | `media/`         |

Also: `supabase/`, `database/`, `api/`, `api-client/`, `auth/`, `email/`, `cloudinary/`, `seo/`, `errors/`, …

## How to add a new volatile capability

1. Create `src/lib/<capability>/` with `types.ts`, `registry.ts`, `README.md`, and `providers/` (or `channels/` / `zones/`).
2. Expose `list*` / `get*` that filter with `isConfigured()`.
3. Optionally add `GET /api/v1/<capability>` + an `api-client` resource.
4. Teach services/UI to resolve from the registry — **no** `if (x === "vendor")` trees.

## Rules

- No business logic here; keep adapters reusable.
- Only `config/*` reads `process.env`.
- Prefer `AppError` for expected failures.
