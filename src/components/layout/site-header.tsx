import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="CVForge"
            className="h-26 w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/templates" className="hover:text-slate-900">
            Templates
          </Link>
          <Link href="/pricing" className="hover:text-slate-900">
            Pricing
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-xl bg-brand-600 px-3 py-2 text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}