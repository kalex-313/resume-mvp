import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";
import { TemplateCatalogGrid } from "@/components/templates/template-catalog";
import { SocialProofStrip } from "@/components/marketing/social-proof-strip";
import { BeforeAfterDemo } from "@/components/marketing/before-after-demo";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import { TrackLink } from "@/components/analytics/track-link";

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
              AI resume builder for serious job applications
            </p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900">
              Build a cleaner resume for your next job application
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Start free, choose an ATS-friendly template, use AI to improve weak wording, and upgrade when you are ready to export a polished PDF.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <TrackLink
                href={user ? "/dashboard" : "/auth/signup"}
                eventName={user ? "dashboard_click" : "sign_up_click"}
                eventParams={{ source: "home_hero" }}
                className="rounded-xl bg-brand-600 px-5 py-3 text-white"
              >
                {user ? "Open Dashboard" : "Start Free"}
              </TrackLink>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700"
              >
                See Pro Features
              </Link>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              No credit card needed to start. Upgrade only when you want unlimited AI rewrite and PDF export.
            </p>

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
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Start from the resume path that fits you</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              Different job searches need different resume angles. Choose a focused RoleArc page for AI rewriting,
              ATS-friendly templates, Canadian applications, student resumes, career changes, entry level roles,
              or polished PDF export.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/ai-resume-builder",
                title: "AI Resume Builder",
                body: "Improve summaries and bullet points while keeping your experience truthful.",
              },
              {
                href: "/ats-resume-templates",
                title: "ATS Resume Templates",
                body: "Use clean layouts with clear sections and recruiter-friendly formatting.",
              },
              {
                href: "/resume-builder-canada",
                title: "Resume Builder for Canada",
                body: "Prepare a clearer resume for Canadian job applications and online hiring portals.",
              },
              {
                href: "/student-resume-builder",
                title: "Student Resume Builder",
                body: "Turn projects, coursework, volunteering, and part-time work into stronger resume content.",
              },
              {
                href: "/career-change-resume-builder",
                title: "Career Change Resume Builder",
                body: "Reframe transferable skills and old-role experience for the next direction.",
              },
              {
                href: "/entry-level-resume-builder",
                title: "Entry Level Resume Builder",
                body: "Create a confident first-role resume with clean wording and practical structure.",
              },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{page.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{page.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <PricingComparison />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
