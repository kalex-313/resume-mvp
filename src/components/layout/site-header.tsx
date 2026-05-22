import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrackLink } from "@/components/analytics/track-link";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="RoleArc"
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
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
              <TrackLink
                href="/auth/signup"
                eventName="sign_up_click"
                eventParams={{ source: "site_header" }}
                className="whitespace-nowrap rounded-xl bg-brand-600 px-3 py-2 text-white"
              >
                Sign up
              </TrackLink>
            </>
          )}
        </nav>

        <nav className="flex min-w-0 items-center gap-2 text-sm text-slate-600 sm:hidden">
          <Link href="/pricing" className="whitespace-nowrap px-1 py-2 hover:text-slate-900">
            Pricing
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 font-medium text-white"
            >
              Dashboard
            </Link>
          ) : (
            <TrackLink
              href="/auth/signup"
              eventName="sign_up_click"
              eventParams={{ source: "site_header_mobile" }}
              className="whitespace-nowrap rounded-lg bg-brand-600 px-3 py-2 font-medium text-white"
            >
              Sign up
            </TrackLink>
          )}
        </nav>
      </div>
    </header>
  );
}
