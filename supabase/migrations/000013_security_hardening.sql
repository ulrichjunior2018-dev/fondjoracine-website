-- Production security hardening (PRD-production-security.md Phase 0)
-- 1) Prevent privilege escalation via profiles.role self-update
-- 2) Allow service-role / system audit inserts with null actor

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    -- Role changes only via service role (dashboard / SQL / admin tooling).
    if auth.role() is distinct from 'service_role' then
      raise exception 'Changing profile role is not allowed';
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;

create trigger profiles_protect_role
  before update on public.profiles
  for each row
  execute function public.protect_profile_role();

-- System / webhook audit events (actor_profile_id null) from the service role.
drop policy if exists "Service role creates audit logs" on public.audit_logs;

create policy "Service role creates audit logs"
  on public.audit_logs
  for insert
  with check (auth.role() = 'service_role');
