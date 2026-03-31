import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeReady";
  const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPath} alt={appName} className="h-8 w-8 rounded-md object-contain" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">
              {appName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-semibold text-slate-900">{appName}</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/templates" className="hover:text-slate-900">Templates</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
              <form action="/auth/signout" method="post">
                <button className="rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-slate-900">Login</Link>
              <Link href="/auth/signup" className="rounded-xl bg-brand-600 px-3 py-2 text-white">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
