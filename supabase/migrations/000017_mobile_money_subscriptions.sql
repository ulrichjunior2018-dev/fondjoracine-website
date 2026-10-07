-- Extends the Stripe-shaped `subscriptions` table (000002 + 000014) to also
-- support "manual-renewal" subscriptions paid via MTN MoMo / Orange Money
-- (Fapshi). Mobile money has no stored-card/token concept, so there is no
-- merchant-initiated auto-charge — instead a daily cron job
-- (/api/cron/mobile-money-renewals) finds subscriptions whose
-- `next_billing_at` has arrived, creates a fresh pending order + Fapshi
-- payment link, and texts it to the customer to approve in their MoMo/Orange
-- app. `next_billing_at` (already present) is the single field that answers
-- "has it been a month" for both billing providers — Stripe's webhooks drive
-- it for card subscriptions, this cron job drives it for mobile money ones.
--
-- All changes are additive against a table that may already have Stripe rows
-- — existing rows default to billing_provider = 'stripe', matching their
-- actual (only) billing provider today.

alter table public.subscriptions
  add column if not exists billing_provider text not null default 'stripe'
    check (billing_provider in ('stripe', 'mobile_money')),
  add column if not exists payment_method text
    check (payment_method is null or payment_method in ('mtn_momo', 'orange_money')),
  add column if not exists last_reminder_sent_at timestamptz,
  add column if not exists pending_renewal_order_id uuid references public.orders(id) on delete set null;

-- Speeds up the cron job's "which subscriptions are due" query without
-- scanning Stripe-billed rows (which never match billing_provider = 'mobile_money').
create index if not exists subscriptions_mobile_money_due_idx
  on public.subscriptions (next_billing_at)
  where billing_provider = 'mobile_money' and status = 'active';

comment on column public.subscriptions.billing_provider is
  'Who drives renewal for this subscription. "stripe" = auto-charged by Stripe Billing. "mobile_money" = manual-renewal via the daily cron job + MTN/Orange payment-link reminder.';
comment on column public.subscriptions.payment_method is
  'Set only when billing_provider = ''mobile_money'' — which network (mtn_momo | orange_money) the renewal reminder should use.';
comment on column public.subscriptions.last_reminder_sent_at is
  'Mobile money only. When the current-cycle renewal reminder was last texted to the customer. Cleared once the renewal is paid.';
comment on column public.subscriptions.pending_renewal_order_id is
  'Mobile money only. The unpaid renewal order currently awaiting payment, if any. Prevents sending a second reminder (and creating a duplicate order) before the first is resolved.';
