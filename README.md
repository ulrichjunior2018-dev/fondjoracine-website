# Maison Fondjo Website

Production website for [fondjoracine.com](https://fondjoracine.com), the one-product Maison Fondjo storefront for Sève Racine hair treatment oil.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Supabase
- Stripe-ready checkout
- Manual MTN Mobile Money and Orange Money preorder flow
- WhatsApp-assisted ordering
- Vercel-ready deployment

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run verify` runs lint, typecheck, and build in sequence.

## Deployment On Vercel

1. Push this repository to GitHub as `fondjoracine-website`.
2. Import the GitHub repository into Vercel.
3. Set the Vercel framework preset to Next.js.
4. Add the environment variables from `.env.example`.
5. Deploy.
6. Point `fondjoracine.com` to the Vercel project.

Vercel build command:

```bash
npm run build
```

Vercel install command:

```bash
npm install
```

## Environment Variables

See `.env.example` for the full list.

Required for a live launch:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `MTN_MOMO_NUMBER`
- `ORANGE_MONEY_NUMBER`
- `ADMIN_EMAIL`

Required when enabling email notifications:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Required when enabling Stripe:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_HAIR_ELIXIR_PRICE_ID`

Optional media integration:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Supabase

Database migrations live in `supabase/migrations`.

Admin routes are protected through Supabase Auth and role permissions. The public order flow uses the service role only inside server route handlers.

## Key Routes

- `/` storefront
- `/product`
- `/pre-order`
- `/hair-consultation`
- `/ingredients`
- `/how-to-use`
- `/origin-story`
- `/faq`
- `/contact`
- `/admin`
- `/policies/privacy`
- `/policies/terms`
- `/policies/returns`
- `/policies/shipping`

## Launch Notes

- Brand, pricing, delivery, batch, and WhatsApp facts are centralized in `src/lib/config.ts`.
- The public ingredient formula is centralized in `src/content/formula.ts`.
- Product safety copy avoids medical, cure, disease, or regrowth claims.
