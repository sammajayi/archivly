-- Archivly Phase 1 schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- auth.users is managed by Supabase Auth already; we only add app tables.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.categories enable row level security;

create policy "categories_select_own"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "categories_insert_own"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "categories_update_own"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "categories_delete_own"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- logs
-- ---------------------------------------------------------------------------
create table if not exists public.logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  outcome text not null check (outcome in ('win', 'loss', 'neutral')),
  date date not null default current_date,
  note text check (char_length(note) <= 280),
  category text,
  -- Storage object path within the log-attachments bucket, not a public URL
  -- (the bucket is private) -- resolve to a viewable link with a signed URL.
  attachment_url text,
  attachment_type text check (attachment_type is null or attachment_type in ('image', 'pdf')),
  created_at timestamptz not null default now()
);

alter table public.logs add column if not exists attachment_url text;
alter table public.logs add column if not exists attachment_type text;
alter table public.logs drop constraint if exists logs_attachment_type_check;
alter table public.logs add constraint logs_attachment_type_check
  check (attachment_type is null or attachment_type in ('image', 'pdf'));

alter table public.logs enable row level security;

create policy "logs_select_own"
  on public.logs for select
  using (auth.uid() = user_id);

create policy "logs_insert_own"
  on public.logs for insert
  with check (auth.uid() = user_id);

create policy "logs_update_own"
  on public.logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "logs_delete_own"
  on public.logs for delete
  using (auth.uid() = user_id);

-- Indexes for the stats dashboard (date-range scans, streaks, per-category rollups)
create index if not exists logs_user_id_date_idx on public.logs (user_id, date desc);
create index if not exists logs_user_id_category_idx on public.logs (user_id, category);

-- ---------------------------------------------------------------------------
-- stats dashboard RPCs
-- ---------------------------------------------------------------------------
-- Pre-aggregated period stats (totals, outcome breakdown, top categories,
-- per-day activity for the heatmap) computed in Postgres so the client never
-- has to pull a full year of rows just to add them up. Runs with the
-- caller's own privileges, so RLS on public.logs still scopes every row to
-- auth.uid() -- the explicit user_id filter below is just an index hint.
create or replace function public.get_period_stats(p_start date, p_end date)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'total', count(*),
    'wins', count(*) filter (where outcome = 'win'),
    'losses', count(*) filter (where outcome = 'loss'),
    'neutrals', count(*) filter (where outcome = 'neutral'),
    'categories', coalesce(
      (select jsonb_agg(jsonb_build_object('category', c.category, 'count', c.cnt))
       from (
         select category, count(*) as cnt
         from public.logs
         where user_id = auth.uid()
           and date between p_start and p_end
           and category is not null
         group by category
         order by cnt desc
         limit 3
       ) c),
      '[]'::jsonb
    ),
    'heatmap', coalesce(
      (select jsonb_agg(jsonb_build_object('date', d.date, 'count', d.cnt))
       from (
         select date, count(*) as cnt
         from public.logs
         where user_id = auth.uid()
           and date between p_start and p_end
         group by date
       ) d),
      '[]'::jsonb
    )
  )
  from public.logs
  where user_id = auth.uid()
    and date between p_start and p_end;
$$;

-- Longest streak is all-time and current streak counts back from today (or
-- yesterday, so a streak isn't shown as broken before the day is over) --
-- both need every logged date, not just the selected period, so this is
-- always computed in Postgres rather than pulled to the client.
create or replace function public.get_streaks()
returns jsonb
language sql
stable
as $$
  with dates as (
    select distinct date
    from public.logs
    where user_id = auth.uid()
    order by date
  ),
  grouped as (
    select date, date - (row_number() over (order by date))::int as grp
    from dates
  ),
  streaks as (
    select min(date) as start_date, max(date) as end_date, count(*) as len
    from grouped
    group by grp
  )
  select jsonb_build_object(
    'longest', coalesce((select max(len) from streaks), 0),
    'current', coalesce(
      (select len from streaks where end_date >= current_date - 1 order by end_date desc limit 1),
      0
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- log-attachments storage bucket
-- ---------------------------------------------------------------------------
-- Private bucket -- objects are only reachable via signed URLs. Files are
-- keyed as {auth.uid()}/{filename}, same "owner folder" convention as the
-- table RLS above, so storage.foldername(name)[1] is the owning user's id.
insert into storage.buckets (id, name, public)
values ('log-attachments', 'log-attachments', false)
on conflict (id) do nothing;

create policy "log_attachments_select_own"
  on storage.objects for select
  using (
    bucket_id = 'log-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "log_attachments_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'log-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "log_attachments_update_own"
  on storage.objects for update
  using (
    bucket_id = 'log-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'log-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "log_attachments_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'log-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
