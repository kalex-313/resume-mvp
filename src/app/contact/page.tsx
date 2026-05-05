import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "RoleArc";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@rolearc.xyz";

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Contact
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Support and contact</h1>
          <p className="mt-4 text-slate-600">
            Contact RoleArc for billing, account access, or resume support.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">Customer support</h2>
              <p className="mt-2">
                For help with billing, account access, or resume issues, contact <span className="font-medium">{supportEmail}</span>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Response time</h2>
              <p className="mt-2">
                {companyName} currently aims to respond to support requests within 1 to 3 business days.
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
