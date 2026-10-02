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
- **`fapshi-client.ts`** — Fapshi aggregator client (`initiatePay`, `getPaymentStatus`) covering both MTN MoMo and Orange Money.
- Checkout UI at `/checkout` lists Card / MTN / Orange via `listCheckoutPaymentMethods()`. Each shows "Soon" until its env keys are set — `isConfigured()` is the single source of truth, there is no separate feature flag.

## Mobile Money: MTN and Orange both go through Fapshi

Maison Fondjo integrates MTN MoMo and Orange Money via **Fapshi**
(fapshi.com), a Cameroon payment aggregator, rather than going direct to each
network's own API. Both `mtn-momo.ts` and `orange-money.ts` descriptors use
`kind: "redirect"` / `redirectProcessor: "mobile_money"` and both resolve to
the exact same `createMobileMoneyCheckout` branch in
`one-product-order-service.ts` — there is nothing network-specific left to
branch on, because Fapshi's `initiate-pay` returns one hosted payment link
regardless of method, and the customer picks MTN or Orange on Fapshi's own
page. The two descriptors exist mainly so checkout can show separate
MTN/Orange buttons and CMS copy; functionally they're identical.

Fulfillment goes through `fulfillMobileMoneyOrder` / `failMobileMoneyOrder`
in the order service (mirrors `fulfillStripeOrder`, keyed by
`orders.mobile_money_reference` — Fapshi's `transId` — instead of a Stripe
session id). The Fapshi webhook (`/api/webhooks/fapshi`) is not trusted
blindly: it re-verifies via `getPaymentStatus` (the source of truth) before
marking an order paid, since Fapshi's webhook payload isn't signed. Because
the webhook only knows `transId`, not which button the customer originally
clicked, `fulfillMobileMoneyOrder`/`failMobileMoneyOrder` read the correct
`mtn_momo` vs `orange_money` value back off the order row itself rather than
trusting a caller-supplied value — don't reintroduce a `provider` param on
those without re-deriving it that way.

**If Maison Fondjo ever moves off Fapshi to direct MTN/Orange APIs**, note
MTN's direct Collection API has no hosted checkout page (push payment to the
phone + poll/webhook for status) while Orange's direct Web Payment API does
(a real hosted redirect) — that asymmetry is why going direct needs more
code than the current Fapshi integration, which the git history around this
file documents if useful as a reference.

## How to add another Mobile Money provider/aggregator (e.g. CinetPay)

1. Add a client module (like `fapshi-client.ts`) reading keys from `@/config/env`.
2. Add a descriptor in `providers/` with `isConfigured` wired to that client.
3. Extend `createMobileMoneyCheckout` in the order service for the new case.
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
