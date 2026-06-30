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
