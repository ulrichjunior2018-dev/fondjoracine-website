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
