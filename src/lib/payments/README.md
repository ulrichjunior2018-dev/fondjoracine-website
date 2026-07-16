# `src/lib/payments` — Payment provider abstraction (WS-2)

**Layer:** Infrastructure
**May import:** `config/*`, `domain/*` (types), `lib/errors`, third-party payment SDKs
**Must NOT:** import `features/*` or CMS content (keep provider logic content-free).

## What this folder is for

A single, extensible home for "how do we take money." Checkout/order code resolves a provider from the registry and reads capability flags — it never branches on a hardcoded provider name. Adding a provider is a new descriptor module + one registry line, with no change to the order flow.

## What lives here

- **`types.ts`** — `PaymentProviderDescriptor` interface + `PaymentKind` (`external_handoff` | `manual_reference` | `redirect`), `PaymentMethodOption`, instruction types.
- **`registry.ts`** — `getPaymentProvider(method)`, `listPaymentProviders()`, `listAvailablePaymentMethods()` (env-gated availability).
- **`providers/`** — one descriptor per method: `whatsapp.ts`, `mtn-momo.ts`, `orange-money.ts`, `stripe-provider.ts`.
- **`stripe.ts`** — low-level Stripe client factory (`getStripeClient`).

## How to add a new payment provider (e.g. PayPal, Flutterwave, CinetPay)

1. Add the method to the domain union in `src/domain/commerce/schemas.ts` (and update related schemas/UI options).
2. Create `providers/<provider>.ts` exporting a `PaymentProviderDescriptor`: set `kind`, `recordsPaymentOnCreate`, `requiresTransactionReference`, `initialPaymentStatus`, `resolveSettlementCurrency`, `buildProviderPaymentId`, and `isConfigured` (env check).
3. Register it in the `providers` array in `registry.ts`.
4. If it needs an SDK client, add `providers/<provider>-client.ts` (like `stripe.ts`), reading keys from `@/config/env`.
5. The order service and `/api/v1/payment-methods` pick it up automatically — no branching to edit.

## Rules & boundaries

- No `input.payment_method === "x"` branches outside a descriptor.
- Descriptors are pure/capability-only; customer-facing instruction _copy_ stays in the content/service layer (documented follow-up to fully port behind a content port).
- `isConfigured()` decides availability from `config/env`, not from hardcoded flags.

## Related

- `src/services/commerce/one-product-order-service.ts` — primary consumer
- `src/app/api/v1/payment-methods/route.ts` + `src/lib/api-client/resources/payments.ts` — availability API + SDK
- `docs/repository-discovery/PRD-architecture-future-readiness.md` — WS-2 rationale
