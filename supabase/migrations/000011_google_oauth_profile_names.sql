-- Google / OAuth users: map provider name fields into profiles on signup.
-- Email signup still uses first_name / last_name from user_metadata.

create or replace function public.handle_new_customer_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_referral_code text;
  v_first text;
  v_last text;
  v_full text;
begin
  v_full := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name',
        ''
      )
    ),
    ''
  );

  v_first := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'given_name',
        case when v_full is not null then split_part(v_full, ' ', 1) else null end,
        ''
      )
    ),
    ''
  );

  v_last := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data ->> 'last_name',
        new.raw_user_meta_data ->> 'family_name',
        case
          when v_full is not null and position(' ' in v_full) > 0
            then trim(substr(v_full, position(' ' in v_full) + 1))
          else null
        end,
        ''
      )
    ),
    ''
  );

  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    v_first,
    v_last
  )
  on conflict (id) do nothing;

  new_referral_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));

  insert into public.customers (profile_id, referral_code)
  values (new.id, new_referral_code)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;
