import Link from "next/link";
import { TrackLink } from "@/components/analytics/track-link";

const steps = [
  "Choose a template",
  "Add your contact details",
  "Rewrite a weak summary with AI",
  "Preview your resume",
  "Upgrade when you need PDF export",
];

export function OnboardingCard({ hasResumes }: { hasResumes: boolean }) {
  return (
    <section className="mb-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            {hasResumes ? "Keep building" : "Start here"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {hasResumes ? "Make your next resume faster" : "Build your first resume in a few focused steps"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Start with a template so you are not staring at a blank page. Add the basics, improve one weak section
            with AI, then decide whether PDF export is worth upgrading for.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <TrackLink
              href="/templates"
              eventName="onboarding_step_click"
              eventParams={{ step: "choose_template", source: "dashboard_onboarding" }}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Choose a template
            </TrackLink>
            <Link
              href="/ai-resume-builder"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              See how AI rewrite helps
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">Recommended path</p>
          <ol className="mt-3 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-700 shadow-sm">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
