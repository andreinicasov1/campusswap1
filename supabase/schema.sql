-- CampusSwap schema (run in Supabase SQL Editor)

create extension if not exists "pgcrypto";

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric not null,
  currency text not null default 'MDL',
  category text not null default 'Other',
  condition text not null default 'Used',
  description text not null default '',
  image_url text,

  seller_id text not null,
  seller_name text not null,
  seller_username text,

  created_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx on public.listings (created_at desc);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reason text not null,
  reporter_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);

-- RLS (optional, because this app uses SERVICE ROLE on server routes)
alter table public.listings enable row level security;
alter table public.reports enable row level security;

-- Minimal read policies if you ever use anon client in browser:
-- create policy "public read listings" on public.listings for select using (true);
-- create policy "public read reports" on public.reports for select using (false);


-- Permissive policies for MVP (NO AUTH). Use with caution.
drop policy if exists "public select listings" on public.listings;
create policy "public select listings" on public.listings
  for select using (true);

drop policy if exists "public insert listings" on public.listings;
create policy "public insert listings" on public.listings
  for insert with check (true);

drop policy if exists "public insert reports" on public.reports;
create policy "public insert reports" on public.reports
  for insert with check (true);
