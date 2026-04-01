"use client";

import { useState } from "react";

type Quota = {
  plan: "free" | "pro";
  used: number;
  limit: number | null;
  remaining: number | null;
};

export function AIRewriteControls({
  section,
  resumeId,
  getText,
  onApply,
  onQuotaUpdate,
}: {
  section: string;
  resumeId: string;
  getText: () => string;
  onApply: (value: string) => void;
  onQuotaUpdate?: (quota: Quota | null) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function runRewrite() {
    const text = getText().trim();

    if (!text) {
      alert("Add some text before using AI rewrite.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
          section,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.code === "FREE_QUOTA_EXHAUSTED") {
          alert("You have used all free AI rewrites for this month. Upgrade to Pro for unlimited access.");
        } else {
          alert(data?.error || "AI rewrite failed.");
        }
        onQuotaUpdate?.(data?.quota || null);
        return;
      }

      if (typeof data.text === "string" && data.text.trim()) {
        onApply(data.text.trim());
      }

      onQuotaUpdate?.(data?.quota || null);
    } catch {
      alert("AI rewrite failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={runRewrite}
      disabled={loading}
      className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
    >
      {loading ? "Rewriting..." : "AI Rewrite"}
    </button>
  );
}
