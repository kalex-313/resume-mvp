alter table public.profiles
add column if not exists stripe_customer_id text,
add column if not exists subscription_status text default 'inactive',
add column if not exists cancel_at_period_end boolean default false,
add column if not exists current_period_end timestamptz;
