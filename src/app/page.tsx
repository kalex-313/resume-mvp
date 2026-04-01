import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";
import { TemplateCatalogGrid } from "@/components/templates/template-catalog";
import { SocialProofStrip } from "@/components/marketing/social-proof-strip";
import { BeforeAfterDemo } from "@/components/marketing/before-after-demo";
import { PricingComparison } from "@/components/marketing/pricing-comparison";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
              CVForge Launch Prep
            </p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900">
              Create job-ready resumes with strong templates, cleaner wording, and a faster workflow
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Choose a layout, improve weak bullets with AI, and export a polished resume that feels ready to send.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={user ? "/dashboard" : "/auth/signup"}
                className="rounded-xl bg-brand-600 px-5 py-3 text-white"
              >
                {user ? "Open Dashboard" : "Create My Resume Free"}
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700"
              >
                See Plans
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Templates</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">6</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI Rewrite</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Built-in</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Export</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">PDF</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Example workflow</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">1. Pick a template</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose ATS, minimal, business, or premium styles before editing.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">2. Rewrite weak wording</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Use AI to sharpen summaries and bullet points into resume-ready language.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">3. Export polished PDF</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Turn the final version into a professional downloadable resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <SocialProofStrip />
        </section>

        <section className="mt-14">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">See how weak wording becomes stronger</h2>
            <p className="mt-2 text-slate-600">
              A simple before-and-after example helps users understand the value of AI rewrite immediately.
            </p>
          </div>
          <BeforeAfterDemo />
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Preview the template library</h2>
              <p className="mt-2 text-slate-600">
                A stronger gallery helps users understand the value before they sign up.
              </p>
            </div>
            <Link href="/templates" className="text-sm font-medium text-brand-600">
              View full gallery
            </Link>
          </div>

          <TemplateCatalogGrid isLoggedIn={!!user} />
        </section>

        <section className="mt-14">
          <PricingComparison />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
