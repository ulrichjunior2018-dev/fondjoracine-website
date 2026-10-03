-- SMS notifications: a dedicated opt-in column (instead of overloading
-- `order_updates`, which already drives email) and a generic send-attempt
-- log so admins can see delivery failures across every channel, not just
-- SMS. Twilio's delivery-status webhook updates rows here by provider_sid.

-- 1) Separate SMS opt-in, per the comment on this table in 000010:
-- "when SMS/push ship, add `sms_*` ... boolean columns ... rather than
-- restructuring this table." Defaults to true so existing customers keep
-- getting order-status texts unless they explicitly opt out.
alter table public.customer_notification_preferences
  add column if not exists sms_updates boolean not null default true;

comment on column public.customer_notification_preferences.sms_updates is
  'Order-status SMS opt-in (Twilio). Independent of order_updates (email) — see 000016.';

-- 2) Generic notification send-attempt log. One row per channel per event
-- (an order "placed" event that fires admin_email + customer_email +
-- customer_sms writes three rows here). Lets admins see "did this actually
-- deliver" instead of only Vercel runtime logs.
create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  channel text not null, -- 'admin_email' | 'customer_email' | 'customer_sms'
  kind text not null, -- 'placed' | 'payment_submitted' | 'confirmed' | 'status_updated'
  status text not null default 'sent', -- 'sent' | 'delivered' | 'failed' | 'undelivered'
  recipient text, -- email or E.164 phone, for admin troubleshooting only
  provider_id text, -- Twilio message SID / Resend email id
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notification_log_order_id_idx on public.notification_log (order_id);
create index if not exists notification_log_provider_id_idx on public.notification_log (provider_id)
  where provider_id is not null;

create trigger set_notification_log_updated_at
  before update on public.notification_log
  for each row execute function public.set_updated_at();

alter table public.notification_log enable row level security;

-- Written by server code using the service-role client (channels run in API
-- routes, not under a customer session) — no customer-facing policy needed.
create policy "Admins read notification log"
  on public.notification_log for select
  using (public.has_admin_permission('customers.read'));

comment on table public.notification_log is
  'One row per notification send attempt (email/SMS) per order lifecycle event. Updated by Twilio status webhook for SMS delivery/failure.';
