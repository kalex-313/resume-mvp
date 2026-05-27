# RoleArc Security Operations

## Cloudflare Turnstile

Create a Turnstile widget for `rolearc.xyz` and add these Vercel environment variables:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES=rolearc.xyz,www.rolearc.xyz`

Keep `TURNSTILE_SECRET_KEY` secret. Do not add `NEXT_PUBLIC_` to the secret key name.

Turnstile is optional in code. If `TURNSTILE_SECRET_KEY` is missing, signup and password reset continue to work without a challenge. Once the secret is present, the server rejects missing or invalid tokens.

## Vercel Firewall Suggested Rule

Vercel dashboard setup:

1. Open the RoleArc project.
2. Go to Firewall.
3. Create one rate limit rule for public auth endpoints.
4. Match path: `/api/auth/` starts with.
5. Strategy: Fixed Window.
6. Time window: `600` seconds.
7. Request limit: `20` requests.
8. Count by: IP Address.
9. Action: Too Many Requests (429).

Keep the app-level limits in place even after Vercel Firewall is enabled. The firewall blocks traffic earlier; the app-level guard protects the backend if traffic reaches the app.

## Weekly Security Review

Every Monday, review:

- Vercel Firewall: auth API rate-limit hits and blocked requests.
- Vercel Analytics: traffic spikes, unusual referrers, or unusual countries.
- Supabase Auth logs: repeated signup, password reset, or login failures.
- Stripe: webhook failures, suspicious payment attempts, or failed billing portal sessions.
- Cloudflare Turnstile: challenge solve rate and suspicious traffic trends.

Escalate if there are repeated spikes from the same IP, country, user agent, or endpoint.

## Security Warning Hygiene

Run this after rotating keys, changing Vercel/Supabase settings, or seeing dashboard warnings:

```powershell
npm run security:warnings
```

The check confirms:

- Production homepage returns `200`.
- Core browser security headers are present.
- CSP still allows Stripe, Google Analytics, Vercel Analytics, Supabase, Gemini/OpenRouter, and Cloudflare Turnstile.
- `/api/health/supabase` rejects requests without `CRON_SECRET`.
- Vercel still has two Supabase keep-alive cron runs.

Dashboard checks that still need manual review:

- Vercel Project > Environment Variables: secrets should not use `NEXT_PUBLIC_`, and any "looks like a secret" warning should be resolved by rotating the value if it was exposed.
- Vercel Firewall: `/api/auth/` rate-limit rule should remain active.
- Supabase Security Advisor: keep `Errors = 0`; fix any new public `SECURITY DEFINER`, missing RLS, or leaked-password warning where the plan supports it.

Latest ROL-10 check on 2026-05-22:

- Production security headers: clean.
- Supabase keep-alive endpoint: protected with `401` for unauthenticated requests.
- Vercel cron config: two daily keep-alive runs.
- Known manual note: Supabase leaked-password protection may require a paid Supabase plan; leave documented if it appears as the only remaining warning.

## Supabase Account Protection

Do this in the Supabase Dashboard account settings:

1. Enable two-factor authentication for the owner account.
2. Save recovery codes in a password manager.
3. Remove unused team members.
4. Keep the service-role key only in Vercel environment variables and local `.env.local`.
5. Rotate keys immediately if a key is pasted into chat, GitHub, screenshots, or public docs.

## Supabase Data API Grants

Supabase is changing public-schema Data API exposure:

- New projects default to explicit grants from 2026-05-30.
- Existing projects keep current behavior until 2026-10-30.
- After enforcement, any new table created in `public` needs explicit grants before PostgREST, GraphQL, or `supabase-js` can access it.

RoleArc's current app tables should keep working because existing grants remain in place, but new tables should not rely on automatic exposure. Use this SQL file after creating or changing public app tables:

```sql
supabase/schema_phase16_data_api_grants.sql
```

Keep the pattern conservative:

- Grant app tables to `authenticated` and `service_role` only when the app needs them.
- Avoid granting app data tables to `anon` unless the table is intentionally public.
- Keep RLS enabled; grants decide whether the table is reachable, while RLS decides which rows are visible.
- Keep `public.handle_new_user_profile()` revoked from `public`, `anon`, and `authenticated`.

## Free App-Data Backup

This repo includes a local backup helper for public app tables:

```powershell
$env:SUPABASE_DB_URL="postgresql://..."
npm run backup:supabase
```

Get `SUPABASE_DB_URL` from Supabase Project Settings > Database > Connection string. Use a direct or session-pooler connection string and keep it private.

The backup is written under `backups/supabase/` and ignored by Git. It covers the public app tables used by RoleArc, including resumes and profiles. It is not a full managed-platform disaster recovery replacement, so keep Supabase's built-in dashboard backups in mind if the project starts earning revenue.
