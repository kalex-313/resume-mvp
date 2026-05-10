import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CheckoutForm } from "@/components/pricing/checkout-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
          Upgrade to Pro
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Get hired faster with a stronger resume
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          RoleArc helps you turn weak drafts into job-ready resumes with better wording,
          premium layouts, and polished export.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What you unlock with Pro</h2>

          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            <li>Unlimited AI rewrite</li>
            <li>All premium templates</li>
            <li>Clean, professional PDF export</li>
            <li>ATS-optimized formatting</li>
            <li>Faster resume editing workflow</li>
          </ul>

          <p className="mt-6 text-xs text-slate-500">
            Most users upgrade after creating their first serious resume.
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>

          {user ? (
            <CheckoutForm />
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/signup"
                className="rounded-xl bg-brand-600 px-6 py-3 text-white hover:opacity-95"
              >
                Create account first
              </Link>
              <Link
                href="/auth/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50"
              >
                Log in to continue
              </Link>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
