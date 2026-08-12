-- Send the welcome email once a user actually confirms their account.
--
-- Fires on auth.users after INSERT or UPDATE, but only actually sends when
-- the user transitions from unconfirmed -> confirmed email:
--   * Email sign-ups: created with email_confirmed_at = null, then an UPDATE
--     sets it on confirmation -- fires then.
--   * Google sign-ins: created already-confirmed -- fires on INSERT.
--
-- It calls the send-welcome-email Edge Function over pg_net (the deprecated
-- supabase_functions.http_request helper is removed, so pg_net is the
-- supported path). The function URL and shared secret are read from the
-- Supabase Vault so no secrets are committed to the repo.
--
-- Prerequisites (run once, then this file):
--   1. Deploy the function:  supabase functions deploy send-welcome-email
--   2. Set secrets:          supabase secrets set RESEND_API_KEY=... FILE
--                            RESEND_FROM_EMAIL=... WELCOME_SECRET=...
--   3. Enable pg_net          (dashboard: Database > Extensions)
--   4. Seed the vault         (see vault_seed below)

create extension if not exists pg_net with schema extensions;

-- ---------------------------------------------------------------------------
-- vault_seed
-- Run once with `supabase db execute` or in the SQL editor (values must match
-- the WELCOME_SECRET you set on the function; set the URL to your project):
--
--   select vault.create_secret(
--     'https://weadocllofmsbsnwhmqu.supabase.co/functions/v1/send-welcome-email',
--     'welcome_function_url'
--   );
--   select vault.create_secret('<your-welcome-secret>', 'welcome_secret');
-- ---------------------------------------------------------------------------

create or replace function public.fn_on_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  function_url text;
  secret text;
  req_id bigint;
  body jsonb;
begin
  -- Only fire on the unconfirmed -> confirmed transition.
  if (TG_OP = 'INSERT' and new.email_confirmed_at is null) then
    return new;
  end if;
  if (TG_OP = 'UPDATE'
     and (old.email_confirmed_at is not null or new.email_confirmed_at is null)) then
    return new;
  end if;

  select decrypted_secret into function_url
  from vault.decrypted_secrets
  where name = 'welcome_function_url';

  select decrypted_secret into secret
  from vault.decrypted_secrets
  where name = 'welcome_secret';

  if function_url is null or secret is null then
    raise notice 'Welcome email skipped: vault not seeded for %', new.email;
    return new;
  end if;

  body := jsonb_build_object(
    'email', new.email,
    'name', new.raw_user_meta_data ->> 'full_name'
  );

  select net.http_post(
    url => function_url,
    body => body,
    headers => jsonb_build_object(
      'Content-Type', 'application/json',
      'x-welcome-secret', secret
    )
  ) into req_id;

  return new;
end;
$$;

drop trigger if exists on_user_confirmed_welcome on auth.users;
create trigger on_user_confirmed_welcome
  after insert or update on auth.users
  for each row execute function public.fn_on_user_confirmed();