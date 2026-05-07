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
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RoleArc",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.rolearc.xyz",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "RoleArc is an AI resume builder for creating cleaner drafts, improving resume wording, and exporting polished PDFs.",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
              AI resume builder for real job applications
            </p>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900">
              Turn a rough resume into a cleaner application-ready draft
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Start free, choose an ATS-friendly template, improve weak wording with AI, and upgrade only when you need premium templates or polished PDF export.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <TrackLink
                href={user ? "/dashboard" : "/auth/signup"}
                eventName={user ? "dashboard_click" : "sign_up_click"}
                eventParams={{ source: "home_hero" }}
                className="rounded-xl bg-brand-600 px-5 py-3 text-white"
              >
                {user ? "Open Dashboard" : "Build My Resume Free"}
              </TrackLink>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700"
              >
                Compare Free vs Pro
              </Link>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              No credit card needed to start. Your draft stays editable before you decide to upgrade.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Start</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Free</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Improve</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">AI rewrite</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Finish</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">PDF export</p>
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

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-sm font-medium text-brand-600">Why people try RoleArc first</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Useful before payment, stronger when you are ready to apply
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Draft before you pay</p>
                <p className="mt-1 text-sm text-slate-600">Create and save a resume before choosing Pro.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Rewrite weak bullets</p>
                <p className="mt-1 text-sm text-slate-600">Turn plain wording into clearer resume language.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Export when finished</p>
                <p className="mt-1 text-sm text-slate-600">Use Pro when you want the polished PDF version.</p>
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
