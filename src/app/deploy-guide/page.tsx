import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

export default function DeployGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Deploy Guide
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Production deployment steps</h1>
          <p className="mt-4 text-slate-600">
            Use this page as your in-app launch checklist while moving from local development to Vercel.
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">1. Push project to GitHub</h2>
              <p className="mt-2">Initialize git, commit your latest version, create a GitHub repository, and push the project.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">2. Import into Vercel</h2>
              <p className="mt-2">Create a new Vercel project from your repository and let Vercel detect Next.js automatically.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">3. Add environment variables</h2>
              <p className="mt-2">Copy your local environment variables into Vercel. Do not expose your service role key publicly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">4. Update providers</h2>
              <p className="mt-2">After Vercel gives you a production domain, update Supabase authentication URLs and Stripe webhook URLs.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">5. Retest the full flow</h2>
              <p className="mt-2">Test signup, login, forgot password, template flow, AI rewrite, billing, and cancellation again on the live URL.</p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
