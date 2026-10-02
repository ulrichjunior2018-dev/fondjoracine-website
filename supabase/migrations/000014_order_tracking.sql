-- Order management & tracking (PRD-order-management-tracking.md)
-- Extends the one-product lifecycle without removing existing statuses.

alter type public.order_status add value if not exists 'order_received';
alter type public.order_status add value if not exists 'preparing';
alter type public.order_status add value if not exists 'out_for_delivery';
alter type public.order_status add value if not exists 'failed';
alter type public.order_status add value if not exists 'returned';

alter table public.orders
  add column if not exists admin_notes text,
  add column if not exists estimated_delivery_start date,
  add column if not exists estimated_delivery_end date,
  add column if not exists status_updated_at timestamptz;

comment on column public.orders.admin_notes is
  'Internal admin-only notes. Never expose to customers.';
comment on column public.orders.estimated_delivery_start is
  'Inclusive start of the customer-facing estimated delivery window.';
comment on column public.orders.estimated_delivery_end is
  'Inclusive end of the customer-facing estimated delivery window.';

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists order_status_events_order_created_idx
  on public.order_status_events(order_id, created_at asc);

alter table public.order_status_events enable row level security;

drop policy if exists "Customers read own order status events" on public.order_status_events;
create policy "Customers read own order status events"
  on public.order_status_events
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and public.order_owns(o.id)
    )
  );

drop policy if exists "Admins manage order status events" on public.order_status_events;
create policy "Admins manage order status events"
  on public.order_status_events
  for all
  using (public.has_admin_permission('orders.read'))
  with check (public.has_admin_permission('orders.write'));

drop policy if exists "Service role manages order status events" on public.order_status_events;
create policy "Service role manages order status events"
  on public.order_status_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
