-- Wire the pre-existing `subscriptions` table (from 000002_ecommerce_backend)
-- up to the one-product Elixir checkout flow. Sève Racine has no product_variants
-- row under the current CMS-driven, one-product model, so this intentionally
-- does NOT touch subscription_items (which FKs to product_variants) — a
-- single-product store only ever needs one subscription row per customer, so
-- price/quantity/amount live directly on `subscriptions`, the same way
-- `orders.metadata` already carries product info instead of joining catalog
-- tables (see 000007_one_product_order_flow).
--
-- All changes are additive (ADD COLUMN IF NOT EXISTS) against a table with
-- zero rows today — safe to run with no downtime and no backfill required.

alter table public.subscriptions
  add column if not exists order_id uuid references public.orders(id) on delete set null,
  add column if not exists stripe_customer_id text,
  add column if not exists price_id text,
  add column if not exists quantity integer not null default 1 check (quantity > 0),
  add column if not exists currency char(3) not null default 'USD',
  add column if not exists amount_cents integer check (amount_cents is null or amount_cents >= 0),
  add column if not exists current_period_end timestamptz;

create index if not exists subscriptions_order_id_idx on public.subscriptions(order_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);

comment on column public.subscriptions.order_id is
  'Most recent order (initial or renewal) this subscription produced. Updated on every invoice.paid renewal.';
comment on column public.subscriptions.price_id is
  'Stripe Price ID (price_...) backing this subscription. Sourced from the Stripe subscription object, never hand-entered.';
comment on column public.subscriptions.amount_cents is
  'Per-cycle amount actually charged, from Stripe — not recomputed locally, so it stays correct through Stripe-side price changes.';
