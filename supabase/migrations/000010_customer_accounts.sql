-- Customer Accounts — essentials (auth, profile, addresses, orders, security, notifications).
--
-- Scope note (product decision): this migration ships only the "essentials" tier
-- of the customer account vision — the account itself, addresses, and a simple
-- notification preference center. It deliberately does NOT add tables for:
--   - Hair profile attributes (type/length/concern/scalp/goals) — add a
--     `customer_hair_profiles` table (customer_id FK, one row per customer) when
--     that feature ships. Nothing here blocks it.
--   - Consultation history — `public.hair_consultations` (000009) already stores
--     this; it just needs a `customer_id` column + backfill when accounts should
--     see their past consultations.
--   - Loyalty points/tiers — `public.customers.lifetime_value_cents` /
--     `orders_count` already accrue; a `loyalty_ledger` table can be added later
--     without touching this schema.
--   - Referral program UI — `public.referrals` (000002) already models
--     referrer/referred/reward; `customers.referral_code` already exists.
--   - Saved payment methods — do not store card data; rely on the payment
--     provider's tokenization (Stripe Customer + saved PaymentMethod) and add a
--     thin `customer_payment_methods` alias table (provider + token id only)
--     when needed.
--   - Hair progress photos — add a `customer_progress_photos` table
--     (customer_id, image_url, captured_at) when that feature ships.
-- All of the above are additive, standalone tables — none require restructuring
-- what's created below.

-- 1) Auto-provision `profiles` + `customers` for every new auth user (email,
--    OAuth, or magic link). Without this, an authenticated user would have no
--    profile/customer row until some app code happened to create one.
-- NOTE: `search_path` intentionally includes `extensions` because Supabase
-- installs pgcrypto/uuid functions there, not in `public`. A security-definer
-- function with `search_path = public` alone cannot resolve extension
-- functions at runtime, which would raise inside the auth signup transaction
-- and surface as an HTTP 500 from /auth/v1/signup. The referral code below
-- deliberately uses only built-ins (md5/random) so it does not depend on
-- pgcrypto being present at all.
create or replace function public.handle_new_customer_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_referral_code text;
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  )
  on conflict (id) do nothing;

  -- Short, URL-safe referral code built from Postgres built-ins (no pgcrypto
  -- dependency). The unique constraint below is the real collision guarantee.
  new_referral_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));

  insert into public.customers (profile_id, referral_code)
  values (new.id, new_referral_code)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_provision_customer on auth.users;
create trigger on_auth_user_created_provision_customer
  after insert on auth.users
  for each row execute function public.handle_new_customer_user();

-- Fallback self-provisioning for accounts created before this trigger existed
-- (`getOrCreateCustomerAccount` in the app inserts defensively if this trigger
-- hasn't already created a row). The trigger itself runs `security definer`
-- and does not need this policy.
create policy "Customers create own customer record"
  on public.customers for insert
  with check (profile_id = auth.uid());

-- 2) Notification preference center (Settings > Notifications).
-- Email is the only channel today; when SMS/push ship, add `sms_*` / `push_*`
-- boolean columns (or a `channels jsonb`) rather than restructuring this table.
create table if not exists public.customer_notification_preferences (
  customer_id uuid primary key references public.customers(id) on delete cascade,
  order_updates boolean not null default true,
  promotions boolean not null default true,
  product_launches boolean not null default true,
  hair_care_tips boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_customer_notification_preferences_updated_at
  before update on public.customer_notification_preferences
  for each row execute function public.set_updated_at();

alter table public.customer_notification_preferences enable row level security;

create policy "Customers manage own notification preferences"
  on public.customer_notification_preferences for all
  using (public.customer_owns(customer_id))
  with check (public.customer_owns(customer_id));

create policy "Admins read notification preferences"
  on public.customer_notification_preferences for select
  using (public.has_admin_permission('customers.read'));

comment on table public.customer_notification_preferences is
  'Per-customer notification opt-in preferences. Email-only today (see column comments in 000010); extend additively for sms/push.';
