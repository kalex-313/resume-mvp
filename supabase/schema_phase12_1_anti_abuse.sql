create extension if not exists "pgcrypto";

create table if not exists public.ai_request_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_hash text,
  user_agent text,
  action_type text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_request_logs enable row level security;

drop policy if exists "Users can view own ai request logs" on public.ai_request_logs;
create policy "Users can view own ai request logs"
on public.ai_request_logs
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own ai request logs" on public.ai_request_logs;
create policy "Users can insert own ai request logs"
on public.ai_request_logs
for insert
with check (auth.uid() = user_id);

create index if not exists idx_ai_request_logs_user_created_at
on public.ai_request_logs(user_id, created_at desc);

create index if not exists idx_ai_request_logs_ip_created_at
on public.ai_request_logs(ip_hash, created_at desc);
