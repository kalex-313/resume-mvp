import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">Resume MVP</Link>
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/pricing">Pricing</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-slate-500">{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/auth/login" className="rounded-lg bg-brand-600 px-4 py-2 text-white">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
