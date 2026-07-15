# 09 — API

All handlers live under `src/app/api/**/route.ts`. Conventions: Zod body/params validation via `src/lib/api/request.ts`, errors via `AppError`, JSON response helpers.

There are **29** `route.ts` files.

---

## Public / lightly gated

| Method | Path                                           | File                                 | Auth                     | Purpose                                      |
| ------ | ---------------------------------------------- | ------------------------------------ | ------------------------ | -------------------------------------------- |
| GET    | `/api/health`                                  | `api/health/route.ts`                | None                     | Health check                                 |
| GET    | `/api/products`                                | `api/products/route.ts`              | Public                   | List products                                |
| GET    | `/api/products/[slug]`                         | `api/products/[slug]/route.ts`       | Public                   | Product by slug                              |
| GET    | `/api/collections`                             | `api/collections/route.ts`           | Public                   | Collections                                  |
| GET    | `/api/categories`                              | `api/categories/route.ts`            | Public                   | Categories                                   |
| POST   | `/api/newsletter`                              | `api/newsletter/route.ts`            | None                     | Upsert newsletter signup                     |
| POST   | `/api/checkout`                                | `api/checkout/route.ts`              | None                     | **Stub** — rejects; directs to elixir orders |
| POST   | `/api/elixir/orders`                           | `api/elixir/orders/route.ts`         | Rate limit 8/15m         | Create one-product order                     |
| GET    | `/api/elixir/orders/[token]`                   | `api/elixir/orders/[token]/route.ts` | Token                    | Fetch order                                  |
| PATCH  | `/api/elixir/orders/[token]/payment-reference` | `.../payment-reference/route.ts`     | Token + rate limit 5/15m | Submit MoMo reference                        |
| POST   | `/api/hair-consultation`                       | `api/hair-consultation/route.ts`     | Rate limit 5/15m         | Create consultation                          |
| PATCH  | `/api/hair-consultation/[id]/whatsapp`         | `.../whatsapp/route.ts`              | UUID knowledge           | Mark WA clicked                              |
| POST   | `/api/webhooks/stripe`                         | `api/webhooks/stripe/route.ts`       | Stripe signature         | Fulfill checkout                             |
| POST   | `/api/support-tickets`                         | `api/support-tickets/route.ts`       | Optional user            | Create ticket                                |

---

## Authenticated user (`requireApiUser`)

| Method            | Path            | Purpose            |
| ----------------- | --------------- | ------------------ |
| GET, POST, PATCH  | `/api/cart`     | Cart CRUD          |
| GET, POST, DELETE | `/api/wishlist` | Wishlist           |
| GET, POST         | `/api/orders`   | Legacy user orders |
| POST              | `/api/reviews`  | Submit review      |

---

## Admin (`requireAdminPermission`)

| Method    | Path                              | Permission(s)                                     | Purpose                       |
| --------- | --------------------------------- | ------------------------------------------------- | ----------------------------- |
| GET       | `/api/admin/analytics`            | `analytics.read`                                  | Analytics summary             |
| GET       | `/api/admin/orders`               | `orders.read`                                     | List orders                   |
| PATCH     | `/api/admin/orders/[id]`          | `orders.write` (+ `payments.write` if confirming) | Update order / verify payment |
| GET, POST | `/api/admin/products`             | `catalog.read` / `catalog.write`                  | Admin catalog                 |
| PATCH     | `/api/admin/content`              | `content.write`                                   | CMS JSON                      |
| PATCH     | `/api/admin/content/images`       | `content.write`                                   | Image slots                   |
| PATCH     | `/api/admin/content/stock`        | `inventory.write`                                 | Stock                         |
| PATCH     | `/api/admin/content/testimonials` | `reviews.write`                                   | Testimonials                  |
| GET       | `/api/admin/customers/export`     | `customers.read`                                  | CSV export                    |
| POST      | `/api/admin/inner-circle`         | `subscriptions.write`                             | Add member                    |
| PATCH     | `/api/admin/inner-circle/[id]`    | `subscriptions.write`                             | Update member                 |

---

## Response / error patterns

- Shared app errors: `src/lib/errors/app-error.ts` (`UNAUTHORIZED`, `FORBIDDEN`, validation, etc.)
- Rate limiting: `src/lib/security/` used on elixir orders, payment refs, hair consultations
- Service role used inside selected public write routes (orders, newsletter, consultations) — secrets never returned to client

## Live consumers vs leftovers

| API family                   | Consumed by live UI?                                   |
| ---------------------------- | ------------------------------------------------------ |
| Elixir orders                | Confirmation page + admin; **create form not mounted** |
| Hair consultation            | Admin list; **agent not mounted**                      |
| Newsletter                   | Admin list; **form not mounted**                       |
| Cart/wishlist/orders/reviews | **No** (pages redirect)                                |
| Catalog GET APIs             | Not required by current one-product pages              |
| Admin APIs                   | **Yes** (`AdminDashboard`)                             |
| Stripe webhook               | Only if Stripe checkout used                           |
