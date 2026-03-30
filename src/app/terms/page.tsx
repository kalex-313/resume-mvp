import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

export default function TermsPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "ResumeReady";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Terms of Service
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{companyName} Terms</h1>
          <p className="mt-4 text-slate-600">
            This page is a starter version for launch preparation. Replace placeholders and obtain legal review if needed.
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">Use of the service</h2>
              <p className="mt-2">
                You may use the service to create and manage resume documents for lawful personal or professional purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Accounts</h2>
              <p className="mt-2">
                You are responsible for maintaining the security of your account and for the content you store in the product.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Subscriptions</h2>
              <p className="mt-2">
                Paid subscriptions are billed through Stripe and may renew automatically until cancelled. Access levels may change
                based on billing status and subscription state.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Acceptable use</h2>
              <p className="mt-2">
                You may not abuse the service, interfere with platform security, or attempt to bypass usage limits or subscription controls.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-2">
                For terms-related questions, contact <span className="font-medium">{supportEmail}</span>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
