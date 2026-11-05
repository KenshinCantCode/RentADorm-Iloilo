create table if not exists public.dorms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  area text not null,
  price text not null,
  rating numeric not null default 4.8,
  distance text,
  gender text,
  beds text,
  description text,
  amenities text[] not null default array[]::text[],
  owner_name text,
  owner_phone text,
  owner_email text,
  image text,
  gallery text[] not null default array[]::text[],
  map_query text,
  latitude double precision,
  longitude double precision
);

alter table public.dorms enable row level security;

create policy "Public can view dorms"
on public.dorms
for select
using (true);

create policy "Authenticated admin can manage dorms"
on public.dorms
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
