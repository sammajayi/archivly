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
  created_at timestamptz not null default now()
);

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
