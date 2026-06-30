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
