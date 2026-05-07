import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/ai/quota";
import { UpgradeButtons } from "@/components/pricing/upgrade-buttons";
import { ATSFriendlyNote } from "@/components/common/ats-friendly-note";
import { TrackLink } from "@/components/analytics/track-link";
import { TrackPageView } from "@/components/analytics/track-page-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing | RoleArc",
  description:
    "Start free with RoleArc, then upgrade to Pro for unlimited AI rewriting, premium templates, and professional PDF export.",
  alternates: {
    canonical: "/pricing",
  },
};

type Props = {
  searchParams: Promise<{ upgrade?: string }>;
};

type ProfileStatus = {
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
  subscription_status: string | null;
};

const PRO_PRICE_LABEL = "$9";
const PRO_PRICE_PERIOD = "/month";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
}

export default async function PricingPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const plan = user ? await getUserPlan(user.id) : "free";
  const proEnabled = plan === "pro";

  let profileStatus: ProfileStatus | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("cancel_at_period_end, current_period_end, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    profileStatus = profile as ProfileStatus | null;
  }

  const scheduledCancellation =
    !!profileStatus?.cancel_at_period_end &&
    !!profileStatus?.current_period_end &&
    new Date(profileStatus.current_period_end).getTime() > Date.now();
  const pricingFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I try RoleArc before paying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Free lets you create and save resumes before upgrading.",
        },
      },
      {
        "@type": "Question",
        name: "When should I upgrade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upgrade when you want unlimited AI rewrites, premium templates, or PDF export.",
        },
      },
      {
        "@type": "Question",
        name: "Is PDF export included in Free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PDF export is a Pro feature so the free plan can stay useful for drafting and testing.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
      />
      <TrackPageView
        eventName="pricing_view"
        eventParams={{
          plan: proEnabled ? "pro" : "free",
          signed_in: !!user,
        }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
              Choose your plan
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Start free. Upgrade when your resume is ready to finish.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Use the builder first, save your draft, and only pay when you want unlimited AI rewriting,
              premium templates, and polished PDF export for serious applications.
            </p>
            <p className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              Free is for drafting and testing. Pro is for finishing, exporting, and applying with a cleaner final resume.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Current plan: <span className="font-semibold">{proEnabled ? "Pro" : "Free"}</span>
            </p>
          </div>
          {user ? <UpgradeButtons isPro={proEnabled} /> : null}
        </div>

        {params.upgrade === "success" ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Payment completed. Your Pro plan should activate shortly.
          </div>
        ) : null}

        {params.upgrade === "cancelled" ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Checkout was cancelled. Your current plan has not changed.
          </div>
        ) : null}

        {params.upgrade === "test-mode-blocked" ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Test checkout is restricted while RoleArc is using Stripe sandbox mode.
          </div>
        ) : null}

        {scheduledCancellation ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your Pro plan is scheduled to cancel on{" "}
            <span className="font-semibold">{formatDate(profileStatus?.current_period_end || null)}</span>.
            You still have Pro access until then.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">Free</p>
              <div className="mt-2 flex items-end gap-1">
                <h2 className="text-3xl font-bold text-slate-900">$0</h2>
                <span className="pb-1 text-sm text-slate-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Create your first draft, test the editor, and see whether RoleArc fits your workflow.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li>Build resumes</li>
              <li>Save drafts</li>
              <li>Limited AI rewrites</li>
              <li>Core templates included</li>
              <li>PDF export locked</li>
              <li>Premium templates locked</li>
            </ul>

            {!user ? (
              <div className="mt-6">
                <TrackLink
                  href="/auth/signup"
                  eventName="sign_up_click"
                  eventParams={{ source: "pricing_free_plan" }}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Start Free
                </TrackLink>
              </div>
            ) : null}
          </div>

          <div
            className={[
              "rounded-3xl bg-white p-6 shadow-sm sm:p-8",
              proEnabled ? "border-2 border-brand-600" : "border border-slate-200",
            ].join(" ")}
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-brand-600">Pro</p>
                <div className="mt-2 flex items-end gap-1">
                  <h2 className="text-3xl font-bold text-slate-900">{PRO_PRICE_LABEL}</h2>
                  <span className="pb-1 text-sm text-slate-500">{PRO_PRICE_PERIOD}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Finish faster when you are ready to apply
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Use Pro for unlimited rewriting, premium layouts, and polished export-ready PDFs without rebuilding your draft.
                </p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                Most Popular
              </span>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li>Unlimited AI rewrite</li>
              <li>All premium templates</li>
              <li>Professional PDF export</li>
              <li>ATS-optimized formatting</li>
              <li>Keep editing after upgrade</li>
            </ul>

            <p className="mt-4 text-xs text-slate-500">
              Best after you have a serious resume draft and want a cleaner final version for applications.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {proEnabled ? (
                scheduledCancellation ? (
                  <p>Your subscription will remain Pro until {formatDate(profileStatus?.current_period_end || null)}.</p>
                ) : (
                  <p>You are currently on the Pro plan.</p>
                )
              ) : (
                <p>Unlock Pro when you want unlimited rewrite power and polished export-ready resumes.</p>
              )}
            </div>

            {!user ? (
              <div className="mt-6">
                <TrackLink
                  href="/upgrade"
                  eventName="upgrade_click"
                  eventParams={{
                    plan: "pro",
                    billing_period: "monthly",
                    source: "pricing_page",
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:opacity-95"
                >
                  Unlock Pro
                </TrackLink>
              </div>
            ) : null}
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">No credit card for Free</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create an account, try the builder, and decide later.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Upgrade keeps your draft</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your saved resume stays in the builder when Pro unlocks export and premium templates.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Manage billing anytime</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Subscribers can open the billing portal from the pricing page.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Common pricing questions</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-slate-900">Can I try RoleArc before paying?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. Free lets you create and save resumes before upgrading.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">When should I upgrade?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upgrade when you want unlimited AI rewrites, premium templates, or PDF export.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Will Pro improve my existing draft?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. You can keep editing the same saved resume after Pro unlocks more tools.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Is PDF export included in Free?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                PDF export is a Pro feature so the free plan can stay useful for drafting and testing.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <ATSFriendlyNote />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
