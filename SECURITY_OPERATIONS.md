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
4. Match paths:
   - `/api/auth/signup`
   - `/api/auth/forgot-password`
5. Count by IP.
6. Start with Log mode if available, then switch to 429 once normal traffic is confirmed.
7. Suggested starting limit: 20 requests per 10 minutes.

Keep the app-level limits in place even after Vercel Firewall is enabled. The firewall blocks traffic earlier; the app-level guard protects the backend if traffic reaches the app.
