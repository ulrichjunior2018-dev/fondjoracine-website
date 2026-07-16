# `src/services/commerce` — Commerce business logic

**Layer:** Business logic (application services)
**May import:** `domain/*`, `lib/*`, `config/*`
**Must NOT:** import `features/*`/`app/*` or render UI.

## What this folder is for

The commerce brain: orders, payments recording, cart, catalog reads, CMS admin, dashboards, consultations, and notifications. Route handlers (`app/api/*`) and server components call these functions; the functions validate with `domain/*` schemas and use `lib/*` adapters.

## What lives here

- **`one-product-order-service.ts`** — the Sève Racine order lifecycle: create order, record payment (via the payment registry), confirmation lookup, submit MoMo reference, admin status updates, Stripe fulfillment.
- **`order-service.ts`**, **`cart-service.ts`**, **`catalog-service.ts`** — generic order/cart/catalog operations (catalog powers `/api/v1/products`).
- **`order-notification-service.ts`** — queues admin email/WhatsApp notifications for orders.
- **`admin-service.ts`**, **`admin-dashboard-service.ts`** — admin CMS + dashboard data.
- **`review-service.ts`**, **`wishlist-service.ts`**, **`support-service.ts`**, **`customer-service.ts`**, **`hair-consultation-service.ts`** — supporting capabilities.

## How to add something new

1. Add a function to the closest-fitting service (or a new `<capability>-service.ts`).
2. Signature: `(supabase, validatedInput) => typed result`; validate input with `domain/commerce/schemas`.
3. Use registries/adapters (payments, email) instead of hardcoding vendors.
4. Throw `AppError` for expected failures.
5. Surface it via `app/api/v1/*` + an `api-client` resource.

## Rules & boundaries

- Behavior-preserving when refactoring the order path: persisted `orders`/`payments` shapes must stay stable.
- No provider-name branching — use `src/lib/payments/registry.ts`.
- Keep notification channels behind the notification service (future: a channel registry).

## Related

- `src/lib/payments/*` — payment abstraction
- `src/domain/commerce/*` — schemas/types
- `src/app/api/v1/products/*`, `payment-methods/*` — exposed endpoints
