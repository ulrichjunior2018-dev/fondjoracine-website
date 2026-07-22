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
- Checkout UI at `/checkout` lists Card / MTN / Orange via `listCheckoutPaymentMethods()`.
  - **Card (Stripe)** — live when Stripe env keys are set.
  - **MTN MoMo / Orange Money** — reserved stubs (`isConfigured: () => false`, `redirectProcessor: "mobile_money"`). Shown as “Soon” until a future MoMo adapter is wired.

## How to add a Mobile Money provider (e.g. CinetPay, Flutterwave)

1. Add a client module (like `stripe.ts`) reading keys from `@/config/env`.
2. Flip `isConfigured` on `mtn-momo.ts` / `orange-money.ts` to check those keys (keep `momoNetwork`).
3. Implement `redirectProcessor === "mobile_money"` in `createProviderCheckout` in the order service (session create + webhook confirm).
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
