# 11 — Environment

Sources: `.env.example`, `src/config/env.ts`, `README.md`.

**Rule:** application code should read env only through `src/config/env.ts` (Zod). Secret values are never documented here.

All variables are strings; empty string is allowed for most optional secrets in the Zod schema.

| Variable                                     | Purpose                      | Required?                                                                              | Prod / Dev        | Related feature                            |
| -------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------ |
| `NEXT_PUBLIC_APP_NAME`                       | Public app/brand name        | Defaulted (`Maison Fondjo`)                                                            | Both              | Branding, metadata                         |
| `NEXT_PUBLIC_SITE_URL`                       | Canonical site URL           | Defaulted (`https://maisonfondjo.com` in env.ts; `.env.example` uses fondjoracine.com) | Both              | SEO, OG, JSON-LD, redirects absolutization |
| `NEXT_PUBLIC_SUPABASE_URL`                   | Supabase project URL         | Recommended for live; optional in schema                                               | Both              | CMS, auth, DB                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`              | Public anon key              | Recommended for live                                                                   | Both              | Client/server anon access                  |
| `SUPABASE_SERVICE_ROLE_KEY`                  | Service role (bypass RLS)    | Required for orders/newsletter/consultations/confirmation writes                       | **Secret — both** | Server-only writes                         |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                | WA business number E.164     | Required for live WA ordering                                                          | Both (public)     | WhatsApp CTAs                              |
| `MTN_MOMO_NUMBER`                            | MTN MoMo pay number          | Required for MoMo instructions                                                         | Secret-ish / ops  | Manual payments                            |
| `ORANGE_MONEY_NUMBER`                        | Orange Money number          | Required for MoMo instructions                                                         | Ops               | Manual payments                            |
| `ADMIN_EMAIL`                                | Admin notification recipient | Recommended                                                                            | Both              | Resend notifications, contact              |
| `RESEND_API_KEY`                             | Resend API                   | When enabling email                                                                    | Secret — prod+    | Order emails                               |
| `RESEND_FROM_EMAIL`                          | From address                 | When enabling email                                                                    | Both              | Order emails                               |
| `STRIPE_SECRET_KEY`                          | Stripe server key            | When enabling card checkout                                                            | Secret — prod+    | Stripe Checkout                            |
| `STRIPE_HAIR_ELIXIR_PRICE_ID`                | Stripe Price ID              | When enabling Stripe                                                                   | Prod+             | One-product Stripe                         |
| `STRIPE_WEBHOOK_SECRET`                      | Webhook signing secret       | When enabling Stripe webhooks                                                          | Secret — prod     | `/api/webhooks/stripe`                     |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`         | Stripe publishable key       | When enabling Stripe UI                                                                | Public            | Stripe.js                                  |
| `NEXT_PUBLIC_STRIPE_PAYMENT_REQUEST_ENABLED` | Wallet/Payment Request flag  | Optional; default false in example                                                     | Feature flag      | Stripe wallets                             |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`          | Cloudinary cloud             | Optional media                                                                         | Public            | Images                                     |
| `CLOUDINARY_API_KEY`                         | Cloudinary API key           | Optional                                                                               | Secret            | Uploads (adapter present)                  |
| `CLOUDINARY_API_SECRET`                      | Cloudinary secret            | Optional                                                                               | Secret            | Uploads                                    |

## README “required for live launch” subset

From `README.md`: app name, site URL, Supabase trio, WhatsApp, MoMo numbers, `ADMIN_EMAIL`. Resend and Stripe called out as conditional. Cloudinary optional.

## Notes / unknowns

- `env.ts` default site URL (`maisonfondjo.com`) **differs** from `.env.example` (`fondjoracine.com`) — production value must be set explicitly on Vercel.
- Whether additional Vercel system env vars exist beyond this list could not be determined from the repository.
- No `.env` files are committed (gitignored); never commit secrets.
