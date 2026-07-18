-- Combined Fondjo Racine migrations (000001 -> 000010)
-- Generated for one-shot execution in the Supabase SQL Editor.
-- Run this ONCE against a fresh project.


-- ============================================================
-- 000001_initial_foundation.sql
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles are editable by owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- 000002_ecommerce_backend.sql
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.product_status as enum ('draft', 'active', 'archived');
create type public.inventory_movement_type as enum ('adjustment', 'sale', 'return', 'reservation', 'release', 'transfer');
create type public.discount_type as enum ('percentage', 'fixed_amount', 'free_shipping');
create type public.order_status as enum ('draft', 'pending', 'paid', 'processing', 'fulfilled', 'cancelled', 'refunded');
create type public.payment_status as enum ('requires_payment_method', 'requires_confirmation', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded');
create type public.fulfillment_status as enum ('unfulfilled', 'partial', 'fulfilled', 'returned');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.subscription_status as enum ('active', 'paused', 'cancelled', 'past_due');
create type public.ticket_status as enum ('open', 'pending', 'resolved', 'closed');
create type public.notification_channel as enum ('email', 'in_app', 'sms');

alter table public.profiles
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists last_seen_at timestamptz;

create table public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  permissions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_user_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.admin_roles(id) on delete cascade,
  granted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  referral_code text not null unique,
  referred_by_customer_id uuid references public.customers(id) on delete set null,
  lifetime_value_cents integer not null default 0 check (lifetime_value_cents >= 0),
  orders_count integer not null default 0 check (orders_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text,
  first_name text not null,
  last_name text not null,
  company text,
  line1 text not null,
  line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country_code char(2) not null,
  phone text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  hero_image_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  description text,
  status public.product_status not null default 'draft',
  brand text not null default 'FONDJO',
  sku_prefix text,
  ingredients text,
  usage_instructions text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  sku text not null unique,
  barcode text unique,
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents is null or compare_at_price_cents >= price_cents),
  currency char(3) not null default 'USD',
  weight_grams integer check (weight_grams is null or weight_grams >= 0),
  option_values jsonb not null default '{}',
  is_default boolean not null default false,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  url text not null,
  alt text not null,
  position integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, product_id)
);

create table public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  location_id uuid not null references public.inventory_locations(id) on delete cascade,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  reorder_threshold integer not null default 0 check (reorder_threshold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (variant_id, location_id),
  check (quantity_reserved <= quantity_on_hand)
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  movement_type public.inventory_movement_type not null,
  quantity integer not null,
  reason text,
  reference_type text,
  reference_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  discount_type public.discount_type not null,
  value integer not null check (value >= 0),
  minimum_subtotal_cents integer not null default 0 check (minimum_subtotal_cents >= 0),
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  redemptions_count integer not null default 0 check (redemptions_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  discount_type public.discount_type not null,
  value integer not null check (value >= 0),
  product_id uuid references public.products(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  anonymous_id uuid,
  currency char(3) not null default 'USD',
  coupon_id uuid references public.coupons(id) on delete set null,
  metadata jsonb not null default '{}',
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or anonymous_id is not null)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  cart_id uuid references public.carts(id) on delete set null,
  status public.order_status not null default 'pending',
  fulfillment_status public.fulfillment_status not null default 'unfulfilled',
  currency char(3) not null default 'USD',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  email citext not null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  coupon_id uuid references public.coupons(id) on delete set null,
  stripe_checkout_session_id text unique,
  metadata jsonb not null default '{}',
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_cents = greatest(subtotal_cents - discount_cents, 0) + shipping_cents + tax_cents)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  title text not null,
  variant_title text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  check (total_cents = unit_price_cents * quantity)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'stripe',
  provider_payment_id text not null,
  status public.payment_status not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency char(3) not null default 'USD',
  captured_at timestamptz,
  refunded_cents integer not null default 0 check (refunded_cents >= 0),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id),
  check (refunded_cents <= amount_cents)
);

create table public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code char(2) not null,
  region text,
  minimum_subtotal_cents integer not null default 0 check (minimum_subtotal_cents >= 0),
  price_cents integer not null check (price_cents >= 0),
  estimated_days_min integer check (estimated_days_min is null or estimated_days_min >= 0),
  estimated_days_max integer check (estimated_days_max is null or estimated_days_max >= estimated_days_min),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tax_rates (
  id uuid primary key default gen_random_uuid(),
  country_code char(2) not null,
  region text,
  rate_bps integer not null check (rate_bps >= 0),
  tax_code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, region, tax_code)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  status public.review_status not null default 'pending',
  is_verified_purchase boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, customer_id, order_id)
);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null default 'Wishlist',
  is_default boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  anonymous_id uuid,
  event_name text not null,
  event_properties jsonb not null default '{}',
  path text,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_customer_id uuid not null references public.customers(id) on delete cascade,
  referred_customer_id uuid references public.customers(id) on delete set null,
  code citext not null,
  reward_coupon_id uuid references public.coupons(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  status public.subscription_status not null default 'active',
  stripe_subscription_id text unique,
  billing_interval text not null check (billing_interval in ('month', 'quarter', 'year')),
  next_billing_at timestamptz,
  paused_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscription_items (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subscription_id, variant_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  channel public.notification_channel not null,
  subject text not null,
  body text not null,
  data jsonb not null default '{}',
  read_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  email citext not null,
  subject text not null,
  status public.ticket_status not null default 'open',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_profile_id uuid references public.profiles(id) on delete set null,
  author_email citext not null,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

create or replace function public.has_admin_permission(permission text, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin(user_id)
    and (
      not exists (
        select 1
        from public.admin_user_roles
        where profile_id = user_id
      )
      or exists (
        select 1
        from public.admin_user_roles aur
        join public.admin_roles ar on ar.id = aur.role_id
        where aur.profile_id = user_id
          and (permission = any(ar.permissions) or '*' = any(ar.permissions))
      )
    );
$$;

create or replace function public.customer_owns(customer uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.customers
    where id = customer and profile_id = user_id
  );
$$;

create or replace function public.cart_owns(cart uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.carts c
    join public.customers cu on cu.id = c.customer_id
    where c.id = cart and cu.profile_id = user_id
  );
$$;

create or replace function public.order_owns(order_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    join public.customers c on c.id = o.customer_id
    where o.id = order_id and c.profile_id = user_id
  );
$$;

create trigger set_admin_roles_updated_at before update on public.admin_roles for each row execute function public.set_updated_at();
create trigger set_customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger set_addresses_updated_at before update on public.addresses for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_product_variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger set_inventory_locations_updated_at before update on public.inventory_locations for each row execute function public.set_updated_at();
create trigger set_inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger set_coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger set_discounts_updated_at before update on public.discounts for each row execute function public.set_updated_at();
create trigger set_carts_updated_at before update on public.carts for each row execute function public.set_updated_at();
create trigger set_cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create trigger set_shipping_rates_updated_at before update on public.shipping_rates for each row execute function public.set_updated_at();
create trigger set_shipments_updated_at before update on public.shipments for each row execute function public.set_updated_at();
create trigger set_tax_rates_updated_at before update on public.tax_rates for each row execute function public.set_updated_at();
create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger set_wishlists_updated_at before update on public.wishlists for each row execute function public.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger set_subscription_items_updated_at before update on public.subscription_items for each row execute function public.set_updated_at();
create trigger set_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();

create index customers_profile_id_idx on public.customers(profile_id);
create index addresses_customer_id_idx on public.addresses(customer_id);
create index categories_parent_id_idx on public.categories(parent_id);
create index products_status_published_at_idx on public.products(status, published_at desc);
create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_images_product_id_idx on public.product_images(product_id, position);
create index collection_products_collection_id_position_idx on public.collection_products(collection_id, position);
create index inventory_items_variant_id_idx on public.inventory_items(variant_id);
create index carts_customer_id_idx on public.carts(customer_id);
create index cart_items_cart_id_idx on public.cart_items(cart_id);
create index orders_customer_id_created_at_idx on public.orders(customer_id, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index payments_order_id_idx on public.payments(order_id);
create index reviews_product_status_idx on public.reviews(product_id, status, created_at desc);
create index wishlists_customer_id_idx on public.wishlists(customer_id);
create index analytics_events_name_created_at_idx on public.analytics_events(event_name, created_at desc);
create index audit_logs_entity_idx on public.audit_logs(entity_table, entity_id, created_at desc);
create index notifications_profile_read_idx on public.notifications(profile_id, read_at);
create index support_tickets_status_created_at_idx on public.support_tickets(status, created_at desc);

alter table public.admin_roles enable row level security;
alter table public.admin_user_roles enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_categories enable row level security;
alter table public.collection_products enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.coupons enable row level security;
alter table public.discounts enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.shipments enable row level security;
alter table public.tax_rates enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.analytics_events enable row level security;
alter table public.referrals enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;

create policy "Admins manage admin roles" on public.admin_roles for all using (public.has_admin_permission('admin.roles.read')) with check (public.has_admin_permission('admin.roles.write'));
create policy "Admins manage admin user roles" on public.admin_user_roles for all using (public.has_admin_permission('admin.roles.read')) with check (public.has_admin_permission('admin.roles.write'));

create policy "Admins read profiles" on public.profiles for select using (public.has_admin_permission('customers.read'));
create policy "Admins update profiles" on public.profiles for update using (public.has_admin_permission('customers.read')) with check (public.has_admin_permission('customers.write'));

create policy "Customers read own customer record" on public.customers for select using (public.customer_owns(id) or public.has_admin_permission('customers.read'));
create policy "Profiles create own customer record" on public.customers for insert with check (profile_id = auth.uid());
create policy "Admins manage customers" on public.customers for all using (public.has_admin_permission('customers.read')) with check (public.has_admin_permission('customers.write'));

create policy "Customers manage own addresses" on public.addresses for all using (public.customer_owns(customer_id)) with check (public.customer_owns(customer_id));
create policy "Admins manage addresses" on public.addresses for all using (public.has_admin_permission('customers.read')) with check (public.has_admin_permission('customers.write'));

create policy "Public reads active categories" on public.categories for select using (is_active or public.has_admin_permission('catalog.read'));
create policy "Admins manage categories" on public.categories for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads active collections" on public.collections for select using (is_active or public.has_admin_permission('catalog.read'));
create policy "Admins manage collections" on public.collections for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads active products" on public.products for select using (status = 'active' or public.has_admin_permission('catalog.read'));
create policy "Admins manage products" on public.products for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads active variants" on public.product_variants for select using (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active') or public.has_admin_permission('catalog.read'));
create policy "Admins manage variants" on public.product_variants for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads product images" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active') or public.has_admin_permission('catalog.read'));
create policy "Admins manage product images" on public.product_images for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads product categories" on public.product_categories for select using (exists (select 1 from public.products p join public.categories c on c.id = category_id where p.id = product_id and p.status = 'active' and c.is_active) or public.has_admin_permission('catalog.read'));
create policy "Admins manage product categories" on public.product_categories for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Public reads collection products" on public.collection_products for select using (exists (select 1 from public.products p join public.collections c on c.id = collection_id where p.id = product_id and p.status = 'active' and c.is_active) or public.has_admin_permission('catalog.read'));
create policy "Admins manage collection products" on public.collection_products for all using (public.has_admin_permission('catalog.read')) with check (public.has_admin_permission('catalog.write'));

create policy "Admins manage inventory locations" on public.inventory_locations for all using (public.has_admin_permission('inventory.read')) with check (public.has_admin_permission('inventory.write'));
create policy "Admins manage inventory items" on public.inventory_items for all using (public.has_admin_permission('inventory.read')) with check (public.has_admin_permission('inventory.write'));
create policy "Admins manage inventory movements" on public.inventory_movements for all using (public.has_admin_permission('inventory.read')) with check (public.has_admin_permission('inventory.write'));

create policy "Public reads active coupons" on public.coupons for select using (is_active or public.has_admin_permission('promotions.read'));
create policy "Admins manage coupons" on public.coupons for all using (public.has_admin_permission('promotions.read')) with check (public.has_admin_permission('promotions.write'));
create policy "Public reads active discounts" on public.discounts for select using (is_active or public.has_admin_permission('promotions.read'));
create policy "Admins manage discounts" on public.discounts for all using (public.has_admin_permission('promotions.read')) with check (public.has_admin_permission('promotions.write'));

create policy "Customers manage own carts" on public.carts for all using (customer_id is null or public.customer_owns(customer_id)) with check (customer_id is null or public.customer_owns(customer_id));
create policy "Admins read carts" on public.carts for select using (public.has_admin_permission('orders.read'));
create policy "Customers manage own cart items" on public.cart_items for all using (public.cart_owns(cart_id)) with check (public.cart_owns(cart_id));
create policy "Admins read cart items" on public.cart_items for select using (public.has_admin_permission('orders.read'));

create policy "Customers read own orders" on public.orders for select using (public.order_owns(id) or public.has_admin_permission('orders.read'));
create policy "Customers create own orders" on public.orders for insert with check (customer_id is not null and public.customer_owns(customer_id));
create policy "Admins manage orders" on public.orders for all using (public.has_admin_permission('orders.read')) with check (public.has_admin_permission('orders.write'));
create policy "Customers read own order items" on public.order_items for select using (public.order_owns(order_id) or public.has_admin_permission('orders.read'));
create policy "Admins manage order items" on public.order_items for all using (public.has_admin_permission('orders.read')) with check (public.has_admin_permission('orders.write'));

create policy "Customers read own payments" on public.payments for select using (exists (select 1 from public.orders o where o.id = order_id and public.order_owns(o.id)) or public.has_admin_permission('payments.read'));
create policy "Admins manage payments" on public.payments for all using (public.has_admin_permission('payments.read')) with check (public.has_admin_permission('payments.write'));

create policy "Public reads active shipping rates" on public.shipping_rates for select using (is_active or public.has_admin_permission('shipping.read'));
create policy "Admins manage shipping rates" on public.shipping_rates for all using (public.has_admin_permission('shipping.read')) with check (public.has_admin_permission('shipping.write'));
create policy "Customers read own shipments" on public.shipments for select using (exists (select 1 from public.orders o where o.id = order_id and public.order_owns(o.id)) or public.has_admin_permission('shipping.read'));
create policy "Admins manage shipments" on public.shipments for all using (public.has_admin_permission('shipping.read')) with check (public.has_admin_permission('shipping.write'));

create policy "Public reads active tax rates" on public.tax_rates for select using (is_active or public.has_admin_permission('taxes.read'));
create policy "Admins manage tax rates" on public.tax_rates for all using (public.has_admin_permission('taxes.read')) with check (public.has_admin_permission('taxes.write'));

create policy "Public reads approved reviews" on public.reviews for select using (status = 'approved' or public.customer_owns(customer_id) or public.has_admin_permission('reviews.read'));
create policy "Customers create own reviews" on public.reviews for insert with check (public.customer_owns(customer_id));
create policy "Admins manage reviews" on public.reviews for all using (public.has_admin_permission('reviews.read')) with check (public.has_admin_permission('reviews.write'));

create policy "Customers manage own wishlists" on public.wishlists for all using (public.customer_owns(customer_id)) with check (public.customer_owns(customer_id));
create policy "Customers manage own wishlist items" on public.wishlist_items for all using (exists (select 1 from public.wishlists w where w.id = wishlist_id and public.customer_owns(w.customer_id))) with check (exists (select 1 from public.wishlists w where w.id = wishlist_id and public.customer_owns(w.customer_id)));

create policy "Customers create analytics events" on public.analytics_events for insert with check (customer_id is null or public.customer_owns(customer_id));
create policy "Admins read analytics events" on public.analytics_events for select using (public.has_admin_permission('analytics.read'));

create policy "Customers read own referrals" on public.referrals for select using (public.customer_owns(referrer_customer_id) or public.customer_owns(referred_customer_id) or public.has_admin_permission('customers.read'));
create policy "Admins manage referrals" on public.referrals for all using (public.has_admin_permission('customers.read')) with check (public.has_admin_permission('customers.write'));

create policy "Customers read own subscriptions" on public.subscriptions for select using (public.customer_owns(customer_id) or public.has_admin_permission('subscriptions.read'));
create policy "Admins manage subscriptions" on public.subscriptions for all using (public.has_admin_permission('subscriptions.read')) with check (public.has_admin_permission('subscriptions.write'));
create policy "Customers read own subscription items" on public.subscription_items for select using (exists (select 1 from public.subscriptions s where s.id = subscription_id and public.customer_owns(s.customer_id)) or public.has_admin_permission('subscriptions.read'));
create policy "Admins manage subscription items" on public.subscription_items for all using (public.has_admin_permission('subscriptions.read')) with check (public.has_admin_permission('subscriptions.write'));

create policy "Admins read audit logs" on public.audit_logs for select using (public.has_admin_permission('audit.read'));
create policy "Admins create audit logs" on public.audit_logs for insert with check (public.is_admin(actor_profile_id));

create policy "Profiles read own notifications" on public.notifications for select using (profile_id = auth.uid() or public.has_admin_permission('notifications.read'));
create policy "Profiles update own notifications" on public.notifications for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Admins manage notifications" on public.notifications for all using (public.has_admin_permission('notifications.read')) with check (public.has_admin_permission('notifications.write'));

create policy "Customers read own support tickets" on public.support_tickets for select using ((customer_id is not null and public.customer_owns(customer_id)) or public.has_admin_permission('support.read'));
create policy "Customers create support tickets" on public.support_tickets for insert with check (customer_id is null or public.customer_owns(customer_id));
create policy "Admins manage support tickets" on public.support_tickets for all using (public.has_admin_permission('support.read')) with check (public.has_admin_permission('support.write'));
create policy "Customers read own ticket messages" on public.support_ticket_messages for select using (exists (select 1 from public.support_tickets t where t.id = ticket_id and t.customer_id is not null and public.customer_owns(t.customer_id)) or public.has_admin_permission('support.read'));
create policy "Customers create own ticket messages" on public.support_ticket_messages for insert with check (exists (select 1 from public.support_tickets t where t.id = ticket_id and t.customer_id is not null and public.customer_owns(t.customer_id)) and is_internal = false);
create policy "Guests create public ticket messages" on public.support_ticket_messages for insert with check (exists (select 1 from public.support_tickets t where t.id = ticket_id and t.customer_id is null) and author_profile_id is null and is_internal = false);
create policy "Admins manage ticket messages" on public.support_ticket_messages for all using (public.has_admin_permission('support.read')) with check (public.has_admin_permission('support.write'));

insert into public.admin_roles (name, description, permissions)
values
  ('Owner', 'Full administrative access.', array['*']),
  ('Commerce Manager', 'Catalog, inventory, orders, promotions, shipping, taxes, reviews, and subscriptions.', array['catalog.read','catalog.write','inventory.read','inventory.write','orders.read','orders.write','promotions.read','promotions.write','shipping.read','shipping.write','taxes.read','taxes.write','reviews.read','reviews.write','subscriptions.read','subscriptions.write','payments.read','payments.write']),
  ('Support Specialist', 'Customer support, notifications, customer lookup, and order visibility.', array['support.read','support.write','customers.read','orders.read','notifications.read','notifications.write'])
on conflict (name) do nothing;

-- ============================================================
-- 000003_newsletter_signups.sql
-- ============================================================

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  source text not null default 'homepage',
  marketing_consent boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

create policy "Admins read newsletter signups"
  on public.newsletter_signups
  for select
  using (public.has_admin_permission('customers.read'));

create policy "Service role inserts newsletter signups"
  on public.newsletter_signups
  for insert
  with check (true);

-- ============================================================
-- 000004_one_product_storefront_cms.sql
-- ============================================================

do $$
begin
  create type public.storefront_content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.storefront_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  status public.storefront_content_status not null default 'draft',
  content jsonb not null,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint storefront_content_key_format check (key ~ '^[a-z0-9-]+$'),
  constraint storefront_content_published_has_date check (
    status <> 'published' or published_at is not null
  )
);

alter table public.storefront_content enable row level security;

create policy "Published storefront content is public"
  on public.storefront_content
  for select
  using (status = 'published');

create policy "Admins read all storefront content"
  on public.storefront_content
  for select
  using (public.has_admin_permission('content.read'));

create policy "Admins write storefront content"
  on public.storefront_content
  for all
  using (public.has_admin_permission('content.write'))
  with check (public.has_admin_permission('content.write'));

create index if not exists storefront_content_key_status_idx
  on public.storefront_content (key, status);

insert into public.storefront_content (key, status, published_at, content)
values (
  'fondjo-racine-seve',
  'published',
  now(),
  -- TODO: Replace with real MTN MoMo number
  -- TODO: Replace with real Orange Money number
  '{
    "id": "fondjo-racine-seve",
    "brand": "FONDJO",
    "slug": "hair-elixir",
    "currency": "USD",
    "priceCents": 0,
    "priceXaf": "Configured in app",
    "title": { "en": "FONDJO Hair Elixir", "fr": "FONDJO Hair Elixir" },
    "description": {
      "en": "A concentrated botanical hair elixir created for dry scalp comfort, luminous length, and a polished luxury ritual in one bottle.",
      "fr": "Un elixir capillaire botanique concentre pour apaiser le cuir chevelu sec, illuminer les longueurs et transformer le soin en rituel premium."
    },
    "seo": {
      "title": { "en": "FONDJO Hair Elixir", "fr": "FONDJO Hair Elixir" },
      "description": {
        "en": "FONDJO Hair Elixir is a premium botanical hair oil for scalp comfort, shine, and luxury hair wellness with Stripe, MoMo, Orange Money, and WhatsApp ordering.",
        "fr": "FONDJO Hair Elixir est une huile capillaire botanique premium pour cuir chevelu, brillance et soin luxe avec Stripe, MoMo, Orange Money et WhatsApp."
      }
    },
    "hero": {
      "eyebrow": { "en": "FONDJO Hair Elixirs", "fr": "FONDJO Hair Elixirs" },
      "title": {
        "en": "Root-to-shine hair oil for a calmer scalp and luminous finish.",
        "fr": "Huile capillaire racine-a-brillance pour un cuir chevelu apaise et une finition lumineuse."
      },
      "primaryCta": { "en": "Order securely", "fr": "Commander en securite" },
      "secondaryCta": { "en": "Pay with MoMo or Orange", "fr": "Payer par MoMo ou Orange" }
    },
    "availability": {
      "en": "Small-batch availability for Cameroon delivery.",
      "fr": "Disponibilite en petites series pour le Cameroun."
    },
    "shipping": {
      "en": "Cameroon delivery coordination by WhatsApp. Card payments supported through Stripe when available.",
      "fr": "Livraison au Cameroun coordonnee par WhatsApp. Paiements par carte par carte via Stripe."
    },
    "whatsapp": {
      "phone": "+19295046726",
      "label": { "en": "Order on WhatsApp", "fr": "Commander sur WhatsApp" },
      "message": {
        "en": "Hello FONDJO, I want to order the Hair Elixir. Please confirm availability, delivery, and payment details.",
        "fr": "Bonjour FONDJO, je veux commander le Hair Elixir. Merci de confirmer la disponibilite, la livraison et le paiement."
      }
    },
    "images": [
      {
        "src": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1400&q=82",
        "width": 1200,
        "height": 1600,
        "alt": {
          "en": "Luxury botanical hair elixir bottle with warm editorial lighting",
          "fr": "Flacon d elixir capillaire botanique luxe en lumiere editoriale chaude"
        }
      },
      {
        "src": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1400&q=82",
        "width": 1200,
        "height": 1200,
        "alt": {
          "en": "Nourishing botanical oil texture for hair and scalp",
          "fr": "Texture d huile botanique nourrissante pour cheveux et cuir chevelu"
        }
      }
    ],
    "highlights": [
      { "label": { "en": "Size", "fr": "Format" }, "value": { "en": "50 ml glass bottle", "fr": "Flacon en verre 50 ml" } },
      { "label": { "en": "Texture", "fr": "Texture" }, "value": { "en": "Lightweight oil serum", "fr": "Serum huile leger" } },
      { "label": { "en": "Use", "fr": "Usage" }, "value": { "en": "Scalp, edges, lengths", "fr": "Cuir chevelu, tempes, longueurs" } }
    ],
    "trust": [
      { "en": "Secure Stripe checkout", "fr": "Paiement Stripe securise" },
      { "en": "MTN MoMo and Orange Money", "fr": "MTN MoMo et Orange Money" },
      { "en": "WhatsApp order support", "fr": "Assistance commande WhatsApp" },
      { "en": "Bilingual customer journey", "fr": "Parcours client bilingue" }
    ],
    "proof": [
      {
        "label": { "en": "Luxury ritual", "fr": "Rituel luxe" },
        "text": {
          "en": "A low-fragrance, high-polish finish designed for daily use in humid climates.",
          "fr": "Un fini peu parfume et tres soigne, pense pour l usage quotidien en climat humide."
        }
      },
      {
        "label": { "en": "Cameroon ready", "fr": "Pret pour le Cameroun" },
        "text": {
          "en": "Mobile money support, WhatsApp ordering, and delivery-first customer flow.",
          "fr": "Paiement mobile money, commande WhatsApp et parcours client pense pour la livraison."
        }
      },
      {
        "label": { "en": "Card payments", "fr": "Paiements par carte" },
        "text": {
          "en": "Stripe checkout is prepared for cards and global payment methods.",
          "fr": "Stripe Checkout est pret pour cartes et moyens de paiement internationaux."
        }
      }
    ],
    "ritual": [
      {
        "step": { "en": "01", "fr": "01" },
        "title": { "en": "Root comfort", "fr": "Confort racines" },
        "text": {
          "en": "Part hair into sections and apply 2-4 drops directly to areas that feel dry or tight.",
          "fr": "Separez les cheveux et appliquez 2 a 4 gouttes sur les zones seches ou inconfortables."
        }
      },
      {
        "step": { "en": "02", "fr": "02" },
        "title": { "en": "Length polish", "fr": "Brillance longueurs" },
        "text": {
          "en": "Warm a small amount between palms and smooth through mid-lengths and ends.",
          "fr": "Chauffez une petite quantite entre les mains puis lissez les longueurs et pointes."
        }
      },
      {
        "step": { "en": "03", "fr": "03" },
        "title": { "en": "Consistent glow", "fr": "Eclat regulier" },
        "text": {
          "en": "Use three nights per week or as a pre-wash ritual for a richer treatment.",
          "fr": "Utilisez trois soirs par semaine ou avant le shampooing pour un soin plus profond."
        }
      }
    ],
    "ingredients": [
      {
        "name": { "en": "Baobab oil", "fr": "Huile de baobab" },
        "note": {
          "en": "Rich in fatty acids to soften dry strands without a heavy finish.",
          "fr": "Riche en acides gras pour assouplir les longueurs seches sans fini lourd."
        }
      },
      {
        "name": { "en": "Moringa seed oil", "fr": "Huile de moringa" },
        "note": {
          "en": "A polished emollient selected for shine, slip, and daily elegance.",
          "fr": "Un emollient raffine choisi pour la brillance, la glisse et l elegance quotidienne."
        }
      },
      {
        "name": { "en": "Mint botanical note", "fr": "Menthe" },
        "note": {
          "en": "A botanical note chosen for a fresh, invigorating sensorial profile.",
          "fr": "Un classique du rituel cuir chevelu pour une sensation fraiche et tonifiante."
        }
      }
    ],
    "manualPayments": {
      "heading": { "en": "Manual mobile money checkout", "fr": "Paiement mobile money manuel" },
      "intro": {
        "en": "Prefer local payment? Send the exact amount, then WhatsApp your payment screenshot and delivery details for confirmation.",
        "fr": "Vous preferez payer localement ? Envoyez le montant exact, puis partagez la capture et l adresse de livraison sur WhatsApp."
      },
      "methods": [
        {
          "label": "MTN MoMo",
          "number": "+237 6 70 00 00 00",
          "accountName": "FONDJO",
          "instructions": {
            "en": "Use merchant transfer, then include your full name and city in the WhatsApp message.",
            "fr": "Utilisez le transfert marchand, puis envoyez votre nom complet et votre ville sur WhatsApp."
          }
        },
        {
          "label": "Orange Money",
          "number": "",
          "accountName": "FONDJO",
          "instructions": {
            "en": "Use Orange Money transfer and keep the confirmation message until your order is confirmed.",
            "fr": "Utilisez le transfert Orange Money et gardez le message de confirmation jusqu a validation."
          }
        }
      ]
    }
  }'::jsonb
)
on conflict (key) do nothing;

-- ============================================================
-- 000005_growth_activation_elixir_homepage.sql
-- ============================================================

insert into public.storefront_content (key, status, published_at, content)
values (
  'fondjo-racine-seve',
  'published',
  now(),
  '{
    "id": "fondjo-racine-seve",
    "brand": "FONDJO",
    "slug": "seve-hair-treatment-oil",
    "currency": "USD",
    "priceCents": 0,
    "priceXaf": "Configured in app",
    "title": {
      "en": "SEVE",
      "fr": "SEVE"
    },
    "hero": {
      "eyebrow": {
        "en": "Premium African botanical hair wellness",
        "fr": "Soin capillaire botanique africain premium"
      },
      "title": {
        "en": "The Cameroonian Hair Oil Backed by a 60-Day Results Guarantee",
        "fr": "L huile capillaire camerounaise avec garantie resultats 60 jours"
      },
      "primaryCta": {
        "en": "Start Free Hair Diagnosis on WhatsApp",
        "fr": "Demarrer le diagnostic gratuit sur WhatsApp"
      },
      "secondaryCta": {
        "en": "See the 60-day routine",
        "fr": "Voir la routine 60 jours"
      }
    },
    "product": {
      "eyebrow": { "en": "The product", "fr": "Le produit" },
      "title": { "en": "SEVE, 100ml.", "fr": "SEVE, 100ml." },
      "name": { "en": "SEVE", "fr": "SEVE" },
      "size": { "en": "100ml", "fr": "100ml" },
      "priceXaf": "Configured in app",
      "description": {
        "en": "A 100ml root-to-length botanical oil created for 60 days of consistent scalp massage, sealing, and visible polish.",
        "fr": "Une huile botanique 100ml racines-a-longueurs pour 60 jours de massage, scellage et finition visible."
      }
    },
    "innerCircle": {
      "eyebrow": { "en": "Inner Circle subscription", "fr": "Abonnement Inner Circle" },
      "title": { "en": "Stay consistent for less each month.", "fr": "Restez reguliere pour moins chaque mois." },
      "priceXaf": "Configured in app",
      "cta": { "en": "Join through WhatsApp", "fr": "Rejoindre via WhatsApp" },
      "benefits": [
        { "en": "Monthly 100ml replenishment", "fr": "Reassort mensuel 100ml" },
        { "en": "WhatsApp progress check-ins", "fr": "Suivi progres sur WhatsApp" },
        { "en": "Priority access to drops and bundles", "fr": "Acces prioritaire aux lancements et packs" }
      ]
    },
    "whatsapp": {
      "phone": "+19295046726",
      "label": { "en": "WhatsApp diagnosis", "fr": "Diagnostic WhatsApp" },
      "diagnosisCta": {
        "en": "Start Free Hair Diagnosis on WhatsApp",
        "fr": "Demarrer le diagnostic gratuit sur WhatsApp"
      },
      "finalCta": {
        "en": "Start my 60-day FONDJO plan",
        "fr": "Commencer mon plan FONDJO 60 jours"
      },
      "message": {
        "en": "Hello FONDJO, I want a free hair diagnosis for breakage, slow growth, dryness, or thinning. Please help me start the 60-day plan.",
        "fr": "Bonjour FONDJO, je veux un diagnostic gratuit pour casse, pousse lente, secheresse ou zones clairsemees. Aidez-moi a commencer le plan 60 jours."
      }
    }
  }'::jsonb
)
on conflict (key) do update
set
  content = public.storefront_content.content || excluded.content,
  status = 'published',
  published_at = coalesce(public.storefront_content.published_at, now()),
  updated_at = now();

-- ============================================================
-- 000006_elixir_cms_editable_content.sql
-- ============================================================

update public.storefront_content
set
  content = content
    || '{
      "inventory": {
        "stockCount": 250,
        "lowStockThreshold": 25
      },
      "socialLinks": {
        "instagram": "https://www.instagram.com/fondjoracine",
        "tiktok": "https://www.tiktok.com/@fondjoracine"
      },
      "launchAnnouncement": {
        "enabled": true,
        "badge": {
          "en": "Launch batch open",
          "fr": "Lot de lancement ouvert"
        },
        "eyebrow": {
          "en": "Now accepting diagnosis orders",
          "fr": "Diagnostics et commandes ouverts"
        },
        "title": {
          "en": "The first FONDJO SEVE batch is available now.",
          "fr": "Le premier lot FONDJO SEVE est disponible maintenant."
        },
        "intro": {
          "en": "Founder-led launch quantities are updated regularly so customers always see the current offer before they order.",
          "fr": "Les quantites de lancement sont mises a jour regulierement pour afficher l offre actuelle avant commande."
        },
        "cta": {
          "en": "Reserve your bottle",
          "fr": "Reserver votre flacon"
        }
      },
      "testimonials": {
        "eyebrow": {
          "en": "Customer notes",
          "fr": "Avis clientes"
        },
        "title": {
          "en": "Guided routines create calmer, more confident customers.",
          "fr": "Les routines accompagnees creent des clientes plus confiantes."
        },
        "items": [
          {
            "name": "Mireille",
            "location": {
              "en": "Douala, Cameroon",
              "fr": "Douala, Cameroun"
            },
            "quote": {
              "en": "The routine feels premium and simple. My scalp stays comfortable longer between wash days.",
              "fr": "La routine est premium et simple. Mon cuir chevelu reste confortable plus longtemps entre les soins."
            },
            "result": {
              "en": "Less dryness after protective styling",
              "fr": "Moins de secheresse apres coiffure protectrice"
            }
          },
          {
            "name": "Clarisse",
            "location": {
              "en": "Yaounde, Cameroon",
              "fr": "Yaounde, Cameroun"
            },
            "quote": {
              "en": "I like that the WhatsApp diagnosis made the oil feel guided, not random.",
              "fr": "J aime que le diagnostic WhatsApp rende l huile accompagnee, pas aleatoire."
            },
            "result": {
              "en": "More consistent application routine",
              "fr": "Rituel cuir chevelu plus regulier"
            }
          },
          {
            "name": "Ange",
            "location": {
              "en": "Buea, Cameroon",
              "fr": "Buea, Cameroun"
            },
            "quote": {
              "en": "The finish is polished without feeling heavy on my ends.",
              "fr": "Le fini est soigne sans alourdir mes pointes."
            },
            "result": {
              "en": "Softer ends and visible shine",
              "fr": "Pointes plus douces et brillance visible"
            }
          }
        ]
      }
    }'::jsonb,
  updated_at = now()
where key = 'fondjo-racine-seve';

comment on table public.storefront_content is
  'CMS content for FONDJO storefront pages. JSON documents are validated by the Next.js Zod schema before rendering.';

comment on column public.storefront_content.content is
  'Editable storefront JSON. Admin-editable fields include hero, products, pricing, ingredients, proof, testimonials, FAQ, founder, guarantee, payments, social links, inventory, subscriptions, and launch announcements.';

-- ============================================================
-- 000007_one_product_order_flow.sql
-- ============================================================

alter type public.order_status add value if not exists 'pending_payment';
alter type public.order_status add value if not exists 'payment_submitted';
alter type public.order_status add value if not exists 'confirmed';
alter type public.order_status add value if not exists 'packed';
alter type public.order_status add value if not exists 'shipped';
alter type public.order_status add value if not exists 'delivered';

alter table public.orders
  alter column email drop not null,
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists delivery_city text,
  add column if not exists delivery_address text,
  add column if not exists payment_method text,
  add column if not exists manual_payment_reference text,
  add column if not exists manual_payment_provider text,
  add column if not exists payment_instructions jsonb not null default '{}',
  add column if not exists confirmation_token text unique default encode(gen_random_bytes(24), 'hex'),
  add column if not exists admin_payment_verified_at timestamptz,
  add column if not exists admin_payment_verified_by uuid references public.profiles(id) on delete set null,
  add constraint orders_one_product_payment_method check (
    payment_method is null
    or payment_method in ('whatsapp', 'mtn_momo', 'orange_money', 'stripe')
  );

create index if not exists orders_confirmation_token_idx on public.orders(confirmation_token);
create index if not exists orders_status_created_at_idx on public.orders(status, created_at desc);
create index if not exists orders_payment_method_created_at_idx on public.orders(payment_method, created_at desc);

comment on column public.orders.status is
  'Order lifecycle. Manual payments start pending_payment, move to payment_submitted after reference submission, and become confirmed after admin verification.';

comment on column public.orders.confirmation_token is
  'Opaque public token used by the confirmation page without exposing sequential order data.';

-- ============================================================
-- 000008_admin_dashboard.sql
-- ============================================================

create table if not exists public.inner_circle_members (
  id uuid primary key default gen_random_uuid(),
  email citext,
  full_name text not null,
  phone text not null,
  city text,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  started_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phone)
);

alter table public.inner_circle_members enable row level security;

drop policy if exists "Admins manage inner circle members" on public.inner_circle_members;
create policy "Admins manage inner circle members"
  on public.inner_circle_members
  for all
  using (public.has_admin_permission('subscriptions.read'))
  with check (public.has_admin_permission('subscriptions.write'));

create index if not exists inner_circle_members_status_created_at_idx
  on public.inner_circle_members(status, created_at desc);

update public.storefront_content
set
  content = jsonb_set(
    content,
    '{testimonials,items}',
    (
      select jsonb_agg(
        case
          when jsonb_typeof(item) = 'object' and not (item ? 'approved')
            then item || '{"approved": true}'::jsonb
          else item
        end
      )
      from jsonb_array_elements(content #> '{testimonials,items}') as item
    ),
    true
  ),
  updated_at = now()
where key = 'fondjo-racine-seve'
  and content #> '{testimonials,items}' is not null;

-- ============================================================
-- 000009_hair_consultations.sql
-- ============================================================

create table if not exists public.hair_consultations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email citext,
  locale text not null default 'en' check (locale in ('en', 'fr')),
  answers jsonb not null,
  recommendation jsonb not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  whatsapp_followup_status text not null default 'not_sent' check (whatsapp_followup_status in ('not_sent', 'clicked', 'sent')),
  consent_given boolean not null default false,
  source text not null default 'ai_hair_consultation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_hair_consultations_updated_at
  before update on public.hair_consultations
  for each row execute function public.set_updated_at();

alter table public.hair_consultations enable row level security;

create index if not exists hair_consultations_created_at_idx
  on public.hair_consultations (created_at desc);

create index if not exists hair_consultations_risk_level_created_at_idx
  on public.hair_consultations (risk_level, created_at desc);

create index if not exists hair_consultations_phone_idx
  on public.hair_consultations (phone);

create policy "Service role creates consultations"
  on public.hair_consultations
  for insert
  with check (auth.role() = 'service_role');

create policy "Admins read consultations"
  on public.hair_consultations
  for select
  using (public.has_admin_permission('customers.read'));

create policy "Admins update consultation followups"
  on public.hair_consultations
  for update
  using (public.has_admin_permission('customers.read'))
  with check (public.has_admin_permission('customers.write'));

comment on table public.hair_consultations is
  'AI hair consultation leads, answers, safety risk level, and WhatsApp follow-up status.';

-- ============================================================
-- 000010_customer_accounts.sql
-- ============================================================

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
create or replace function public.handle_new_customer_user()
returns trigger
language plpgsql
security definer
set search_path = public
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

  -- Short, URL-safe referral code; collision retry is unnecessary in practice
  -- given the keyspace, but the unique constraint below is the real guarantee.
  new_referral_code := upper(substr(replace(encode(gen_random_bytes(6), 'base64'), '/', 'x'), 1, 8));

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
