"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { clearRecoveryParameters, initializePasswordRecovery, RECOVERY_LINK_ERROR } from "@/lib/password-recovery";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const initialization = useRef<Promise<void> | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!initialization.current) {
      const url = new URL(window.location.href);
      initialization.current = initializePasswordRecovery(supabase.auth, url).finally(() => {
        window.history.replaceState(null, "", clearRecoveryParameters(url));
      });
    }
    initialization.current.then(() => {
      if (active) setSessionReady(true);
    }).catch(() => {
      if (active) setError(RECOVERY_LINK_ERROR);
    }).finally(() => {
      if (active) setCheckingSession(false);
    });
    return () => { active = false; };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionReady || checkingSession || loading) return;
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !data.user) {
        setSessionReady(false);
        setError(RECOVERY_LINK_ERROR);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        if (updateError.name === "AuthSessionMissingError") {
          setSessionReady(false);
          setError(RECOVERY_LINK_ERROR);
        } else {
          setError(updateError.message || "Could not update password.");
        }
        return;
      }

      setMessage("Password updated successfully. Redirecting to login...");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => { router.push("/auth/login"); }, 1200);
    } catch {
      setError("Could not update password. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
        Reset password
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Set your new password
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Enter a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {checkingSession ? <p role="status" className="text-sm text-slate-600">Verifying your reset link...</p> : null}
        <div>
          <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-700">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            disabled={!sessionReady || loading}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="mb-1 block text-sm font-medium text-slate-700">
            Confirm new password
          </label>
          <input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            disabled={!sessionReady || loading}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm the new password"
            required
          />
        </div>

        {message ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            {!sessionReady && !checkingSession ? (
              <Link href="/auth/forgot-password" className="mt-2 block font-medium underline">Request a new reset link</Link>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading || checkingSession || !sessionReady || !!message}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Updating password..." : "Update password"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Back to{" "}
        <Link href="/auth/login" className="font-medium text-brand-600">
          login
        </Link>
      </p>
    </div>
  );
}
