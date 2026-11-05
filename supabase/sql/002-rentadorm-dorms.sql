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
  room_types jsonb not null default '[]'::jsonb,
  owner_name text,
  owner_phone text,
  owner_email text,
  owner_facebook text,
  status text not null default 'Available' check (status in ('Available', 'Reserved', 'Unavailable')),
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

drop policy if exists "Authenticated admin can manage dorms" on public.dorms;

create policy "Authenticated admin can manage dorms"
on public.dorms
for select
using (auth.uid() is not null and exists (
  select 1 from public.admin_profiles ap where ap.id = auth.uid()
));

create policy "Authenticated admin can insert dorms"
on public.dorms
for insert
with check (
  auth.uid() is not null and exists (
    select 1 from public.admin_profiles ap where ap.id = auth.uid()
  )
);

create policy "Authenticated admin can update dorms"
on public.dorms
for update
using (
  auth.uid() is not null and exists (
    select 1 from public.admin_profiles ap where ap.id = auth.uid()
  )
)
with check (
  auth.uid() is not null and exists (
    select 1 from public.admin_profiles ap where ap.id = auth.uid()
  )
);

create policy "Authenticated admin can delete dorms"
on public.dorms
for delete
using (
  auth.uid() is not null and exists (
    select 1 from public.admin_profiles ap where ap.id = auth.uid()
  )
);
