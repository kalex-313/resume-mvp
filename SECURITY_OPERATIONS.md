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

## Supabase Account Protection

Do this in the Supabase Dashboard account settings:

1. Enable two-factor authentication for the owner account.
2. Save recovery codes in a password manager.
3. Remove unused team members.
4. Keep the service-role key only in Vercel environment variables and local `.env.local`.
5. Rotate keys immediately if a key is pasted into chat, GitHub, screenshots, or public docs.

## Free App-Data Backup

This repo includes a local backup helper for public app tables:

```powershell
$env:SUPABASE_DB_URL="postgresql://..."
npm run backup:supabase
```

Get `SUPABASE_DB_URL` from Supabase Project Settings > Database > Connection string. Use a direct or session-pooler connection string and keep it private.

The backup is written under `backups/supabase/` and ignored by Git. It covers the public app tables used by RoleArc, including resumes and profiles. It is not a full managed-platform disaster recovery replacement, so keep Supabase's built-in dashboard backups in mind if the project starts earning revenue.
