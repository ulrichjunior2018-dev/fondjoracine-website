# `src/lib/notifications` — Notification channel abstraction (WS-3)

**Layer:** Infrastructure
**May import:** `config/*`, `lib/*` (email, logger, database), third-party SDKs
**Must NOT:** import `features/*` or throw out of a channel (a failed notification must never fail the order).

## What this folder is for

A single, extensible home for "tell someone something happened." Order/checkout code fires an event (`dispatchOrderPlacedNotifications`) and each configured channel decides whether/how to deliver it. Adding a channel (SMS, push, Slack, mobile push) is a new module + one registry line — the order flow doesn't change.

## What lives here

- **`types.ts`** — `NotificationChannel` interface + event payloads (`OrderPlacedNotification` with `kind`: `placed` | `payment_submitted` | `confirmed`).
- **`channels/`** — one channel per delivery mechanism:
  - `admin-email.ts` — Resend back-office email for every order lifecycle event (including card).
  - `customer-email.ts` — buyer confirmation emails (EN/FR); respects Account → Notifications `order_updates` when `customerId` is set.
- **`registry.ts`** — `listNotificationChannels()` and `dispatchOrderPlacedNotifications(event)`.

## How to add a new channel (e.g. SMS, WhatsApp auto-send, push, Slack)

1. Create `channels/<channel>.ts` exporting a `NotificationChannel`: set `key`, `isConfigured()` (env check), and `notifyOrderPlaced(event)` — wrap all work in try/catch + `logger`; never throw.
2. Register it in the `channels` array in `registry.ts`.
3. Done — `queueOrderNotifications` picks it up automatically.

## Rules & boundaries

- Channels must be resilient: catch and log, never propagate errors to the order path.
- `isConfigured()` decides availability from `config/env`, not hardcoded flags.
- No feature/CMS imports here; pass everything needed on the event payload.
- Customer emails require `customerEmail` on the event (from checkout or Stripe session).

## Related

- `src/services/commerce/order-notification-service.ts` — commerce entry point that delegates here
- `src/lib/email/resend.ts` — email transport
- `docs/repository-discovery/PRD-architecture-future-readiness.md` — WS-3 rationale
