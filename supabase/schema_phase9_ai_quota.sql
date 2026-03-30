create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  preferred_language text default 'en',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

create table if not exists public.ai_usage_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid null references public.resumes(id) on delete set null,
  action_type text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_usage_events enable row level security;

drop policy if exists "Users can view own ai usage events" on public.ai_usage_events;
create policy "Users can view own ai usage events"
on public.ai_usage_events
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own ai usage events" on public.ai_usage_events;
create policy "Users can insert own ai usage events"
on public.ai_usage_events
for insert
with check (auth.uid() = user_id);
