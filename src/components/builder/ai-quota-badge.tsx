"use client";

type Quota = {
  plan: "free" | "pro";
  used: number;
  limit: number | null;
  remaining: number | null;
};

export function AIQuotaBadge({ quota }: { quota: Quota | null }) {
  if (!quota) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Loading AI usage...
      </div>
    );
  }

  if (quota.plan === "pro") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        Pro plan: unlimited AI rewrite
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      Free plan AI rewrites this month: <span className="font-semibold">{quota.used}/{quota.limit}</span>
      <span className="ml-2">Remaining: <span className="font-semibold">{quota.remaining}</span></span>
    </div>
  );
}
