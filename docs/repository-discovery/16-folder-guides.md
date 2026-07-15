# 16 — Folder Guides (per-folder mini-PRDs)

Every major folder now ships a `README.md` that acts as a small PRD: **what it's for**, **what lives there**, **how to add something new in the future**, and **the rules/boundaries** that keep the architecture intact. Read the guide for a folder before adding code to it.

## Layer map (dependency direction points inward)

```
config ─┐
domain ─┼─► services ─► app (pages + api) ─► (browser)
lib ────┘         ▲              │
                  └── features ──┘
components / hooks / providers / state / styles  (presentation support)
content / i18n                                   (content data)
```

Golden rules (see `docs/ARCHITECTURE.md`):

- `domain` imports nothing framework/infra.
- Only `config` reads `process.env`.
- `lib` never imports `features`/`app`.
- `services` hold business logic; UI and API routes stay thin.

## Guide index

| Folder                  | Guide                                           | In one line                                     |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `src/app`               | [README](../../src/app/README.md)               | Routes, layouts, metadata, API entry            |
| `src/app/api`           | [README](../../src/app/api/README.md)           | HTTP endpoints; prefer `v1/`                    |
| `src/components`        | [README](../../src/components/README.md)        | Shared presentational UI + 3D                   |
| `src/config`            | [README](../../src/config/README.md)            | Validated env/config (only env reader)          |
| `src/content`           | [README](../../src/content/README.md)           | Static marketing copy + formula facts           |
| `src/domain`            | [README](../../src/domain/README.md)            | Framework-free types & Zod schemas              |
| `src/features`          | [README](../../src/features/README.md)          | Feature modules (elixir, commerce, admin, home) |
| `src/features/elixir`   | [README](../../src/features/elixir/README.md)   | Flagship Sève Racine storefront                 |
| `src/hooks`             | [README](../../src/hooks/README.md)             | Shared client hooks                             |
| `src/i18n`              | [README](../../src/i18n/README.md)              | Locale dictionaries (en/fr/es)                  |
| `src/lib`               | [README](../../src/lib/README.md)               | Infrastructure adapters & utilities             |
| `src/lib/api-client`    | [README](../../src/lib/api-client/README.md)    | Typed `/api/v{n}` SDK                           |
| `src/lib/payments`      | [README](../../src/lib/payments/README.md)      | Payment provider abstraction + registry         |
| `src/lib/notifications` | [README](../../src/lib/notifications/README.md) | Notification channel abstraction + registry     |
| `src/lib/motion`        | [README](../../src/lib/motion/README.md)        | GSAP motion layer entry point                   |
| `src/lib/supabase`      | [README](../../src/lib/supabase/README.md)      | RLS-respecting Supabase clients                 |
| `src/lib/database`      | [README](../../src/lib/database/README.md)      | Schema helpers + service-role client            |
| `src/providers`         | [README](../../src/providers/README.md)         | App-wide React providers                        |
| `src/services`          | [README](../../src/services/README.md)          | Application/business services                   |
| `src/services/commerce` | [README](../../src/services/commerce/README.md) | Commerce business logic                         |
| `src/state`             | [README](../../src/state/README.md)             | Client state helpers                            |
| `src/styles`            | [README](../../src/styles/README.md)            | Global styles + design tokens                   |

## Common "how do I add…" quick links

- **A new page** → `src/app/README.md`
- **A new API endpoint** → `src/app/api/README.md` (then add an SDK resource in `src/lib/api-client`)
- **A new payment provider** → `src/lib/payments/README.md`
- **A new notification channel (SMS/push/Slack)** → `src/lib/notifications/README.md`
- **A new environment variable** → `src/config/README.md` + `.env.example`
- **A new translated string / locale** → `src/i18n/README.md`
- **A new business operation** → `src/services/README.md`
- **A new storefront section** → `src/features/elixir/README.md`
- **A new design token** → `src/styles/README.md`

## Maintenance

When you add or move a folder, add/update its `README.md` and this index. Keep guides short — they describe intent and extension points, not every line of code.
