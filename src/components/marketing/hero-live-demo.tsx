"use client";

import { TrackLink } from "@/components/analytics/track-link";

export function HeroLiveDemo({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section
      id="live-demo"
      aria-label="RoleArc live resume rewrite demo"
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Live demo</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">One weak bullet, rewritten clearly</h2>
        </div>
        <span className="whitespace-nowrap rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          No card needed
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Before</p>
            <span className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Helped customers and answered questions.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-brand-600 rolearc-demo-scan" />
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-700">After RoleArc</p>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-brand-700 shadow-sm">
              ATS-ready
            </span>
          </div>
          <p className="rolearc-demo-text text-sm leading-6 text-slate-800">
            Supported 40+ customer inquiries per day, clarified order issues, and improved response consistency across daily service workflows.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {["Clearer wording", "Stronger action", "Ready to edit"].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <TrackLink
          href={isLoggedIn ? "/dashboard" : "/auth/signup"}
          eventName={isLoggedIn ? "dashboard_click" : "sign_up_click"}
          eventParams={{ source: "home_live_demo" }}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
        >
          {isLoggedIn ? "Open Dashboard" : "Try this on my resume"}
        </TrackLink>
        <p className="text-xs text-slate-500">Start free. Upgrade only when you need Pro export.</p>
      </div>
    </section>
  );
}
