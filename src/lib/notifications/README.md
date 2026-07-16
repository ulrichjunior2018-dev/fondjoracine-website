# `src/lib/notifications` — Notification channel abstraction (WS-3)

**Layer:** Infrastructure
**May import:** `config/*`, `lib/*` (email, logger), third-party SDKs
**Must NOT:** import `features/*` or throw out of a channel (a failed notification must never fail the order).

## What this folder is for

A single, extensible home for "tell someone something happened." Order/checkout code fires an event (`dispatchOrderPlacedNotifications`) and each configured channel decides whether/how to deliver it. Adding a channel (SMS, push, Slack, mobile push) is a new module + one registry line — the order flow doesn't change.

## What lives here

- **`types.ts`** — `NotificationChannel` interface + event payloads (`OrderPlacedNotification`).
- **`channels/`** — one channel per delivery mechanism. Today: `admin-email.ts` (Resend back-office email; skips Stripe, which is webhook-confirmed; owns its HTML template; never throws).
- **`registry.ts`** — `listNotificationChannels()` and `dispatchOrderPlacedNotifications(event)` (fans out to all channels, swallowing per-channel errors).

## How to add a new channel (e.g. SMS, WhatsApp auto-send, push, Slack)

1. Create `channels/<channel>.ts` exporting a `NotificationChannel`: set `key`, `isConfigured()` (env check), and `notifyOrderPlaced(event)` — wrap all work in try/catch + `logger`; never throw.
2. Register it in the `channels` array in `registry.ts`.
3. Done — `queueOrderNotifications` picks it up automatically.

**A new event type** (e.g. "order shipped"): add the payload to `types.ts`, a `notify<Event>` method to the interface, a `dispatch<Event>` in the registry, and implement it per channel.

## Rules & boundaries

- Channels must be resilient: catch and log, never propagate errors to the order path.
- `isConfigured()` decides availability from `config/env`, not hardcoded flags.
- No feature/CMS imports here; pass everything needed on the event payload.

## Related

- `src/services/commerce/order-notification-service.ts` — commerce entry point that delegates here
- `src/lib/email/resend.ts` — email transport used by the admin-email channel
- `docs/repository-discovery/PRD-architecture-future-readiness.md` — WS-3 rationale
