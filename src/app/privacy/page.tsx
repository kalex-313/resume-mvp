import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "ResumeReady";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Privacy Policy
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">How {companyName} handles your data</h1>
          <p className="mt-4 text-slate-600">
            This page is a launch-ready starter policy. Replace any placeholder details before going live.
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">Information we collect</h2>
              <p className="mt-2">
                We collect account details such as email address, resume content you create in the builder,
                subscription records, and limited technical data needed to secure the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">How we use your information</h2>
              <p className="mt-2">
                We use your information to provide the resume builder, store your drafts, process subscriptions,
                support AI rewrite features, prevent abuse, and respond to customer support requests.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Payments</h2>
              <p className="mt-2">
                Payments and billing details are handled by Stripe. We do not store your full card number on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Data storage</h2>
              <p className="mt-2">
                Resume drafts and account-related information may be stored with our infrastructure providers so the service
                can function properly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-2">
                For privacy questions, contact us at <span className="font-medium">{supportEmail}</span>.
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
