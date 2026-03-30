"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue editing your resumes.</p>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-brand-600">
              Forgot password?
            </Link>
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-medium text-white disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
        </div>
        <p className="mt-4 text-sm text-slate-600">Need an account? <Link href="/auth/signup" className="text-brand-600">Sign up</Link></p>
      </form>
    </main>
  );
}
