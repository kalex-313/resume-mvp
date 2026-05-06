"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { TurnstileWidget } from "@/components/security/turnstile-widget";

const COOLDOWN_SECONDS = 60;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      setError((current) =>
        current?.includes("Too many requests") ? null : current
      );
      return;
    }

    const timer = setTimeout(() => {
      setCooldown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cooldown > 0) {
      setError(`Too many requests. Please wait ${cooldown}s before trying again.`);
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, turnstileToken })
      });

      const data = await response.json();

      if (!response.ok) {
        const raw = String(data?.error || "").toLowerCase();

        if (raw.includes("rate limit")) {
          setCooldown(COOLDOWN_SECONDS);
          setError(`Too many requests. Please wait ${COOLDOWN_SECONDS} seconds before trying again.`);
        } else {
          setError(data?.error || "Could not send reset email.");
        }

        return;
      }

      setMessage(`If an account exists for this email, a reset link has been sent. Please wait ${COOLDOWN_SECONDS} seconds before requesting another one.`);
      setCooldown(COOLDOWN_SECONDS);
    } catch {
      setError("Could not send reset email.");
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Forgot password
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reset your password
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Enter your email address and we will send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {message ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <TurnstileWidget
              siteKey={turnstileSiteKey}
              resetKey={turnstileResetKey}
              onTokenChange={handleTurnstileToken}
            />

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading
                ? "Sending reset link..."
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Send reset link"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Remembered your password?{" "}
            <Link href="/auth/login" className="font-medium text-brand-600">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
