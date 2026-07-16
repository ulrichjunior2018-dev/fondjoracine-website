# `src/services` — Application services (Business logic)

**Layer:** Business logic / application services
**May import:** `domain/*`, `lib/*`, `config/*`
**Must NOT:** import `features/*` or `app/*`, or render UI. Services are callable from any transport (web API, future mobile API, jobs).

## What this folder is for

The verbs of the system: place an order, list the catalog, record a payment, send notifications, run a consultation. Services orchestrate domain rules + `lib` adapters (Supabase, Stripe, Resend, …). API route handlers and server components call services; services never call back into UI.

## What lives here

- **`commerce/`** — the bulk of business logic (orders, cart, catalog, admin CMS, dashboards, reviews, support, consultations, notifications). See `commerce/README.md`.
- **`customer/customer-service.ts`** — the customer account surface: resolves/creates the `customers` row for a signed-in user, profile updates, addresses, the customer's own order history, and notification preferences. Backs `app/api/v1/account/*`.
- **`auth/auth-service.ts`** — pre-existing auth-operations interface (not implemented; account auth today goes through Supabase directly from `features/account/lib/auth-client.ts`, see that file's header comment).
- **`catalog/product-repository.ts`** — catalog data access (repository style).
- **`customer/customer-repository.ts`**, **`order/order-repository.ts`** — older stub interfaces, superseded by `customer/customer-service.ts` for the account surface.

> Some `*-repository.ts` files are older/stub-style. When extending, prefer the pattern used by the actively-maintained `commerce/*` services.

## How to add something new

1. Add a function to the right context folder (create one if it's a new bounded context).
2. Signature convention: take the Supabase client (from the caller) + a Zod-validated input, return typed data.
3. Validate with `domain/*` schemas; use `lib/*` adapters for I/O.
4. Throw `AppError` (from `src/lib/errors`) for expected failures so the API layer controls exposure.
5. Expose it through an `app/api/v1/*` route + an `api-client` resource.

## Rules & boundaries

- No framework/UI imports; keep services transport-agnostic.
- Don't hardcode vendor names — resolve via registries (payments, and future notifications).
- One operation = one well-named function.

## Related

- `src/domain/*` — schemas/types services validate against
- `src/lib/*` — adapters services use
- `src/app/api/*` — HTTP entry that calls services
