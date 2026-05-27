-- Supabase Data API explicit grants
-- Supabase is making Data API exposure opt-in for new public tables.
-- Existing tables keep their current grants, but new tables should grant only
-- the roles and privileges the app actually needs.

grant usage on schema public to authenticated, service_role;

-- User-owned resume records. RLS still controls row-level access.
grant select, insert, update, delete
on table public.resumes
to authenticated, service_role;

-- User profile and subscription state. Stripe/admin code uses service_role;
-- signed-in users can read/update their own profile through RLS.
grant select, insert, update
on table public.profiles
to authenticated, service_role;

-- AI usage events are user-owned and used for quota/account visibility.
grant select, insert
on table public.ai_usage_events
to authenticated, service_role;

-- AI request logs are user-owned anti-abuse records.
grant select, insert
on table public.ai_request_logs
to authenticated, service_role;

-- Keep-alive writes are performed by a protected Vercel Cron route using the
-- service role. Do not expose this table to anon or regular authenticated users.
grant select, insert
on table public.keep_alive_events
to service_role;

-- Keep Security Advisor clean while keeping client access denied. The
-- service_role bypasses RLS for the protected cron route.
drop policy if exists "No public keep alive access" on public.keep_alive_events;
drop policy if exists "No client keep alive access" on public.keep_alive_events;

create policy "No client keep alive access"
on public.keep_alive_events
for all
to anon, authenticated
using (false)
with check (false);

-- Identity/serial sequences need explicit privileges when exposed through the
-- Data API. This currently matters for keep_alive_events and future identity
-- columns.
grant usage, select
on all sequences in schema public
to authenticated, service_role;

-- Security-definer trigger function should not be directly callable through
-- the Data API by public roles.
revoke execute on function public.handle_new_user_profile() from public;
revoke execute on function public.handle_new_user_profile() from anon;
revoke execute on function public.handle_new_user_profile() from authenticated;
