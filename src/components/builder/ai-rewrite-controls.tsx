"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Quota = {
  plan: "free" | "pro";
  used: number;
  limit: number | null;
  remaining: number | null;
};

type Tone = "concise" | "balanced" | "detailed";

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
  const [tone, setTone] = useState<Tone>("balanced");

  async function runRewrite() {
    trackEvent("ai_rewrite_click", {
      section,
      tone,
      source: "resume_builder",
    });

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
          tone,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.code === "FREE_QUOTA_EXHAUSTED") {
          window.location.href = "/upgrade";
          return;
        }

        alert(data?.error || "AI rewrite failed.");
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
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value as Tone)}
        className="min-w-[120px] rounded-lg border border-slate-300 px-2 py-2 text-xs text-slate-700"
      >
        <option value="concise">Concise</option>
        <option value="balanced">Balanced</option>
        <option value="detailed">Detailed</option>
      </select>

      <button
        type="button"
        onClick={runRewrite}
        disabled={loading}
        className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {loading ? "Rewriting..." : "AI Rewrite"}
      </button>

      <div className="basis-full text-[11px] leading-5 text-slate-500 sm:basis-auto sm:max-w-[210px]">
        AI improves wording only. Please review before use.
      </div>
    </div>
  );
}
