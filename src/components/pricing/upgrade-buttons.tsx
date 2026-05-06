"use client";

import { TrackLink } from "@/components/analytics/track-link";

export function UpgradeButtons({ isPro }: { isPro: boolean }) {
  if (isPro) {
    return (
      <form action="/api/stripe/portal" method="POST">
        <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Manage Subscription
        </button>
      </form>
    );
  }

  return (
    <TrackLink
      href="/upgrade"
      eventName="upgrade_click"
      eventParams={{
        plan: "pro",
        billing_period: "monthly",
        source: "pricing_page",
      }}
      className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:opacity-95"
    >
      Start My Pro Plan
    </TrackLink>
  );
}
