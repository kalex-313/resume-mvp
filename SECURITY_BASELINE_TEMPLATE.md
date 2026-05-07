# Reusable Website Security Baseline

This project includes a portable security starter kit based on RoleArc's launch hardening work.

## Generate The Baseline

From a new Next.js project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-security-baseline.ps1 `
  -AppName "My App" `
  -Domain "example.com" `
  -SupportEmail "support@example.com"
```

From this repo, you can run:

```powershell
npm run security:baseline
```

The script creates:

- `next.config.mjs` with production security headers.
- `src/lib/security/rate-limit.ts`.
- `src/lib/security/turnstile.ts`.
- `src/components/security/turnstile-widget.tsx`.
- `.env.security.example`.
- `SECURITY_OPERATIONS.md`.

Existing files are skipped unless you pass `-Force`.

## What It Covers

- HTTPS hardening through HSTS.
- Clickjacking protection.
- MIME sniffing protection.
- Referrer policy.
- Basic permissions policy.
- Content Security Policy for Stripe, Supabase, Google Analytics, Vercel Analytics, Gemini, OpenRouter, and Cloudflare Turnstile.
- Server-side API rate limiting.
- Cloudflare Turnstile server-side verification.
- Vercel Firewall rule checklist.
- Account 2FA and key-handling checklist.
- Backup reminders.

## What Still Needs Manual Wiring

Every app has different routes, so the script does not edit business logic automatically. After generation, wire these manually:

- Signup route: rate limit + Turnstile.
- Forgot-password route: rate limit + Turnstile.
- Payment/checkout routes: authenticated user check + rate limit.
- User-data mutation routes: authenticated user check + ownership check + rate limit.
- Webhook routes: verify provider signatures, do not use normal user auth.
- Cron routes: protect with a long secret.

## Recommended Defaults

- Signup: 5 requests per 15 minutes by IP.
- Forgot password: 5 requests per 15 minutes by IP + email action.
- Checkout: 10 requests per 15 minutes by user.
- Billing portal: 20 requests per 15 minutes by user.
- User-data save/update: high enough for normal autosave, for example 120 requests per minute.
- Vercel Firewall auth rule: 20 requests per 600 seconds by IP.

## Important Limits

The included rate limiter is in-process. It is free and useful, but it is not a global durable WAF. For higher-traffic apps, add an edge/firewall rule or durable store such as Redis.
