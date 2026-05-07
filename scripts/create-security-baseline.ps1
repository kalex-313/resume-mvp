param(
  [string]$AppName = "NewApp",
  [string]$Domain = "example.com",
  [string]$SupportEmail = "support@example.com",
  [string]$OutputDir = ".",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-FileIfMissing {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $resolvedPath = Join-Path $OutputDir $Path

  if ((Test-Path $resolvedPath) -and -not $Force) {
    Write-Host "Skip existing: $resolvedPath"
    return
  }

  $parent = Split-Path $resolvedPath -Parent
  if ($parent) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  Set-Content -Path $resolvedPath -Value $Content -Encoding UTF8
  Write-Host "Wrote: $resolvedPath"
}

$domainNoWww = $Domain -replace "^www\.", ""
$wwwDomain = if ($domainNoWww -eq "localhost") { "localhost" } else { "www.$domainNoWww" }
$siteUrl = if ($domainNoWww -eq "localhost") { "http://localhost:3000" } else { "https://$wwwDomain" }
$allowedHostnames = if ($domainNoWww -eq "localhost") { "localhost,127.0.0.1" } else { "$domainNoWww,$wwwDomain,localhost,127.0.0.1" }

$nextConfig = @"
/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://api.openrouter.ai https://generativelanguage.googleapis.com https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://vercel.live https://challenges.cloudflare.com",
      "frame-src https://checkout.stripe.com https://billing.stripe.com https://vercel.live https://challenges.cloudflare.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
"@

$rateLimit = @'
import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type RateLimitOptions = {
  action: string;
  limit: number;
  windowMs: number;
  userId?: string | null;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 1_000;
const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000;

function hashIp(input: string | null) {
  if (!input) return null;
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function getRequestIpHash() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || null;

  return hashIp(ip);
}

function getBucketKey(action: string, ipHash: string | null, userId?: string | null) {
  const subject = userId ? `user:${userId}` : `ip:${ipHash || "unknown"}`;
  return `${action}:${subject}:${ipHash || "no-ip"}`;
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const ipHash = await getRequestIpHash();
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const key = getBucketKey(options.action, ipHash, options.userId);
  const timestamps = (buckets.get(key) || []).filter((timestamp) => timestamp >= windowStart);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucketTimestamps] of buckets) {
      const newestTimestamp = bucketTimestamps[bucketTimestamps.length - 1] || 0;
      if (newestTimestamp < now - CLEANUP_AFTER_MS) {
        buckets.delete(bucketKey);
      }
    }
  }

  if (timestamps.length >= options.limit) {
    const oldest = timestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    buckets.set(key, timestamps);

    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function rateLimitResponse(message = "Too many requests. Please wait a few minutes and try again.") {
  return function createResponse(result: RateLimitResult) {
    const response = NextResponse.json(
      {
        error: message,
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );

    response.headers.set("Retry-After", String(result.retryAfterSeconds));
    return response;
  };
}
'@

$turnstile = @"
import { headers } from "next/headers";

type TurnstileSiteverifyResponse = {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_ALLOWED_HOSTNAMES = "$allowedHostnames";

function getAllowedHostnames() {
  return (process.env.TURNSTILE_ALLOWED_HOSTNAMES || DEFAULT_ALLOWED_HOSTNAMES)
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
}

export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");

  return forwarded?.split(",")[0]?.trim() || realIp || undefined;
}

export async function verifyTurnstileToken(token: string | null | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: true, enabled: false };
  }

  if (!token) {
    return { ok: false, enabled: true, reason: "missing-token" };
  }

  let response: Response;

  try {
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: await getClientIp(),
      }),
    });
  } catch {
    return { ok: false, enabled: true, reason: "siteverify-unreachable" };
  }

  if (!response.ok) {
    return { ok: false, enabled: true, reason: "siteverify-error" };
  }

  const result = (await response.json()) as TurnstileSiteverifyResponse;
  const hostname = result.hostname?.toLowerCase();
  const allowedHostnames = getAllowedHostnames();
  const hostnameAllowed = !hostname || allowedHostnames.includes(hostname);

  if (!result.success || !hostnameAllowed) {
    return {
      ok: false,
      enabled: true,
      reason: result["error-codes"]?.join(",") || "verification-failed",
    };
  }

  return { ok: true, enabled: true };
}
"@

$turnstileWidget = @'
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey?: string;
  resetKey?: number;
  onTokenChange: (token: string) => void;
};

export function TurnstileWidget({ siteKey, resetKey = 0, onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;
    const activeSiteKey = siteKey;

    function renderWidget() {
      if (cancelled || !window.turnstile || !containerRef.current || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: activeSiteKey,
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
    }

    if (!document.querySelector('script[data-turnstile="true"]')) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    const interval = window.setInterval(renderWidget, 250);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
    };
  }, [siteKey, resetKey, onTokenChange]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className="min-h-[65px]" />;
}
'@

$envExample = @"
NEXT_PUBLIC_SITE_URL=$siteUrl
NEXT_PUBLIC_APP_NAME=$AppName
NEXT_PUBLIC_SUPPORT_EMAIL=$SupportEmail
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
TURNSTILE_ALLOWED_HOSTNAMES=$allowedHostnames
CRON_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
"@

$securityOperations = @"
# $AppName Security Operations

## Baseline Included

- Next.js security headers and CSP.
- In-process API rate-limit helper.
- Cloudflare Turnstile server-side validation helper.
- Cloudflare Turnstile React widget.
- Production environment variable template.
- Vercel Firewall checklist.
- Account protection and backup checklist.

## How To Apply

1. Review `next.config.mjs` before replacing an existing config.
2. Copy `src/lib/security/rate-limit.ts` into protected API routes.
3. Copy `src/lib/security/turnstile.ts` and `src/components/security/turnstile-widget.tsx` into signup and forgot-password flows.
4. Add the environment variables from `.env.security.example`.
5. Run `npm run build`.

## API Route Pattern

```ts
const rateLimit = await checkRateLimit({
  action: "auth:signup",
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

if (!rateLimit.allowed) {
  return rateLimitResponse("Too many attempts. Please try again later.")(rateLimit);
}

const turnstile = await verifyTurnstileToken(body.turnstileToken);

if (!turnstile.ok) {
  return NextResponse.json(
    { error: "Verification failed. Please refresh the page and try again.", code: "TURNSTILE_FAILED" },
    { status: 400 }
  );
}
```

## Vercel Firewall Rule

- Match path: `/api/auth/` starts with.
- Strategy: Fixed Window.
- Time window: `600` seconds.
- Request limit: `20` requests.
- Count by: IP Address.
- Action: Too Many Requests (429).

## Cloudflare Turnstile

Create one Turnstile widget for:

- `$domainNoWww`
- `$wwwDomain`

Add:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES=$allowedHostnames`

## Account Protection

- Enable 2FA on Vercel, Supabase, Cloudflare, GitHub, Stripe, and domain registrar accounts.
- Store recovery codes in a password manager.
- Keep service-role and secret keys out of `NEXT_PUBLIC_` variables.
- Rotate keys immediately if exposed in chat, screenshots, GitHub, or public docs.

## Backups

- Keep app-data backups outside Git.
- Add `backups/` to `.gitignore`.
- For Supabase projects, use database backups or a local dump workflow before major changes.
"@

Write-FileIfMissing -Path "next.config.mjs" -Content $nextConfig
Write-FileIfMissing -Path "src/lib/security/rate-limit.ts" -Content $rateLimit
Write-FileIfMissing -Path "src/lib/security/turnstile.ts" -Content $turnstile
Write-FileIfMissing -Path "src/components/security/turnstile-widget.tsx" -Content $turnstileWidget
Write-FileIfMissing -Path ".env.security.example" -Content $envExample
Write-FileIfMissing -Path "SECURITY_OPERATIONS.md" -Content $securityOperations

Write-Host ""
Write-Host "Security baseline created for $AppName ($Domain)."
Write-Host "Next: wire the helpers into signup, forgot-password, payment, and mutation API routes."
Write-Host "Run with -Force only when you intentionally want to overwrite existing files."
