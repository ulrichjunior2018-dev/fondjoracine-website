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
