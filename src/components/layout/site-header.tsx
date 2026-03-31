import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "CVForge";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CVForge"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-semibold text-slate-900">
            {appName}
          </span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/templates">Templates</Link>
          <Link href="/pricing">Pricing</Link>

          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <form action="/auth/signout" method="post">
                <button className="border px-3 py-2 rounded-xl">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-3 py-2 rounded-xl">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}