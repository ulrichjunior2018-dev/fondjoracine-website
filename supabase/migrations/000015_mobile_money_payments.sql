-- Mobile Money payments (MTN MoMo Collection API + Orange Money Web Payment API).
-- Mirrors stripe_checkout_session_id: stores the provider-side reference used to
-- look up / confirm a redirect or push-payment transaction from webhooks and
-- the status-polling endpoint.

alter table public.orders
  add column if not exists mobile_money_reference text unique;

comment on column public.orders.mobile_money_reference is
  'MTN MoMo X-Reference-Id (push payment) or Orange Money pay_token (hosted redirect). '
  'Set when the order is placed with payment_method mtn_momo / orange_money and used '
  'by the provider webhook + status-polling endpoint to locate the order.';

create index if not exists orders_mobile_money_reference_idx
  on public.orders (mobile_money_reference)
  where mobile_money_reference is not null;
