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
