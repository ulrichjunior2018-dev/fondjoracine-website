# `src/app/api` — HTTP endpoints (API layer)

**Layer:** API / transport
**May import:** `services/*`, `domain/*`, `lib/*`, `config/*`
**Must NOT:** contain business logic (delegate to `services/*`) or read `process.env` directly.

## What this folder is for

Route Handlers (`route.ts`) that expose the backend over HTTP. Their job is narrow: parse & validate input → call a service → return a JSON envelope. Consistent envelope helpers live in `src/lib/api/responses.ts` (`ok`, `fail`) and request parsing in `src/lib/api/request.ts`.

## Structure

- **`v1/`** — the versioned, contract-stable API. This is the canonical surface consumed by the web app and any future mobile client through the SDK in `src/lib/api-client`. Current: `health/`, `products/`, `products/[slug]/`, `payment-methods/`.
- **Unversioned (legacy/internal):** `products/`, `collections/`, `categories/`, `cart/`, `checkout/`, `orders/`, `reviews/`, `wishlist/`, `newsletter/`, `support-tickets/`, `hair-consultation/`, `elixir/orders/*`, `health/`.
- **`admin/`** — admin-only endpoints (content, products, orders, analytics, customers export, inner-circle). Must enforce RBAC via `src/lib/auth/rbac.ts`.
- **`webhooks/stripe/`** — inbound Stripe webhook; verifies signature, then calls the order service.

## How to add a new endpoint

Prefer `api/v1/<resource>/route.ts`:

1. Define/extend the Zod schema in `src/domain/<context>/schemas.ts`.
2. In the handler: `parseSearchParams` / parse the body, get a Supabase client from `src/lib/supabase/server.ts`, call the relevant `services/*` function.
3. Return `ok(data)` on success, `fail(error)` on throw. Never leak internals — `AppError` controls what is exposed.
4. Add `export const dynamic = "force-dynamic"` for request-dependent reads.
5. Add a typed client function in `src/lib/api-client/resources/*` so callers stay off raw `fetch`.

## Rules & boundaries

- Validate every input with Zod at the boundary.
- Admin routes: check role before doing anything.
- Keep provider/vendor names out of handlers — resolve via registries (e.g. `src/lib/payments/registry.ts`).

## Related

- `src/lib/api/*` — envelope + request helpers
- `src/lib/api-client/*` — the typed consumer SDK
- `src/services/*` — where the actual work happens
