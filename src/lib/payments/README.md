# `src/lib/payments` — Payment provider abstraction (WS-2)

**Layer:** Infrastructure
**May import:** `config/*`, `domain/*` (types), `lib/errors`, third-party payment SDKs
**Must NOT:** import `features/*` or CMS content (keep provider logic content-free).

## What this folder is for

A single, extensible home for "how do we take money." Checkout/order code resolves a provider from the registry and reads capability flags — it never branches on a hardcoded provider name. Adding a provider is a new descriptor module + one registry line, with no change to the order flow.

## What lives here

- **`types.ts`** — `PaymentProviderDescriptor` interface + `PaymentKind` (`external_handoff` | `manual_reference` | `redirect`), `PaymentMethodOption`, instruction types.
- **`registry.ts`** — `getPaymentProvider(method)`, `listPaymentProviders()`, `listAvailablePaymentMethods()` (env-gated availability), `listCheckoutPaymentMethods()` (Card + MTN + Orange preview).
- **`providers/`** — one descriptor per method: `whatsapp.ts`, `mtn-momo.ts`, `orange-money.ts`, `stripe-provider.ts`.
- **`stripe.ts`** — Stripe client factory (`getStripeClient`).
- **`mtn-momo-client.ts`** — MTN MoMo Collection API client (OAuth token, `requestToPay`, `getTransactionStatus`).
- **`orange-money-client.ts`** — Orange Money Web Payment API client (OAuth token, `createWebPayment`, `getTransactionStatus`).
- Checkout UI at `/checkout` lists Card / MTN / Orange via `listCheckoutPaymentMethods()`. Each shows "Soon" until its env keys are set — `isConfigured()` is the single source of truth, there is no separate feature flag.

## Mobile Money: how MTN and Orange differ (important)

Both use `kind: "redirect"` / `redirectProcessor: "mobile_money"`, but the actual
customer flow is different, and `createProviderCheckout` (in
`one-product-order-service.ts`) branches on `provider.momoNetwork` to handle it:

- **MTN MoMo** has no hosted checkout page. `requestToPay` pushes a PIN prompt
  straight to the customer's phone and returns immediately — there is no URL
  to redirect to. So the "redirect" target is our own page,
  `/checkout/momo-pending`, which polls `/api/payments/mtn-momo/status` every
  few seconds until MTN reports `SUCCESSFUL` / `FAILED`, then forwards to the
  real order confirmation page. The MTN webhook (`X-Callback-Url`, registered
  per-request) is a *best-effort* fast path only — polling is the reliable
  path, since sandbox callback delivery in particular cannot be relied on.
- **Orange Money** returns a real `payment_url` from `createWebPayment` —
  the customer is redirected there directly, same as Stripe Checkout. Orange
  calls `notif_url` (our webhook) on completion, and redirects the browser
  back to `return_url` either way. Neither is trusted blindly: both the
  webhook and the status-poll re-verify via `getTransactionStatus` /
  `transactionstatus` (the source of truth) before marking an order paid.

Order fulfillment for both goes through the shared
`fulfillMobileMoneyOrder` / `failMobileMoneyOrder` in the order service
(mirrors `fulfillStripeOrder`, keyed by `orders.mobile_money_reference`
instead of a Stripe session id) — idempotent, safe to call from both the
webhook and the poller for the same order.

## How to add another Mobile Money provider (e.g. CinetPay, Flutterwave)

1. Add a client module (like `mtn-momo-client.ts`) reading keys from `@/config/env`.
2. Add a descriptor in `providers/` with `isConfigured` wired to that client (keep `momoNetwork` if it's MTN/Orange-compatible, or extend the union otherwise).
3. Extend `createProviderCheckout` in the order service for the new case — decide whether it's a true hosted redirect (like Orange) or needs its own pending/poll page (like MTN).
4. Add a webhook route under `src/app/api/webhooks/<provider>/`.

## How to add a new payment method (e.g. PayPal)

1. Add the method to the domain union in `src/domain/commerce/schemas.ts` (and update related schemas/UI options).
2. Create `providers/<provider>.ts` exporting a `PaymentProviderDescriptor`.
3. Register it in the `providers` array in `registry.ts`.
4. If it needs an SDK client, add a client module reading keys from `@/config/env`.

## Rules & boundaries

- No `input.payment_method === "x"` branches outside a descriptor.
- Descriptors are pure/capability-only; customer-facing instruction _copy_ stays in the content/service layer.
- `isConfigured()` decides availability from `config/env` (or fixed `false` for reserved stubs), not from hardcoded UI branches.

## Related

- `src/services/commerce/one-product-order-service.ts` — primary consumer
- `src/app/api/v1/payment-methods/route.ts` + `src/lib/api-client/resources/payments.ts` — availability API + SDK
- `docs/repository-discovery/PRD-architecture-future-readiness.md` — WS-2 rationale
