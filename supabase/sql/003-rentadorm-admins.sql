create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  is_admin boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy "Admins can view their own profile"
on public.admin_profiles
for select
using (auth.uid() = id);

create policy "Admins can update their own profile"
on public.admin_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can insert their own profile"
on public.admin_profiles
for insert
with check (auth.uid() = id);
