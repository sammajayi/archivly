-- Archivly waitlist table (archivly-web pre-launch page).
-- Run this in the same Supabase project as archivly-app's schema.sql,
-- via the SQL Editor (or `supabase db push`).

create extension if not exists "uuid-ossp";

create table if not exists public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Anyone can join the waitlist (the form is public and unauthenticated),
-- but nobody can read it back through the API -- no select policy exists,
-- and RLS defaults to deny, so submitted emails aren't scrapeable.
create policy "waitlist_insert_anyone"
  on public.waitlist for insert
  to anon
  with check (true);
