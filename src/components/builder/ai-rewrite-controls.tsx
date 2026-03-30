"use client";

import { useState } from "react";

type Props = {
  section: "summary" | "bullet";
  resumeId: string;
  getText: () => string;
  onApply: (value: string) => void;
  onQuotaUpdate?: (quota: {
    plan: "free" | "pro";
    used: number;
    limit: number | null;
    remaining: number | null;
  }) => void;
};

export function AIRewriteControls({ section, resumeId, getText, onApply, onQuotaUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRewrite(mode: "professional" | "concise") {
    const text = getText().trim();

    if (!text) {
      alert("Please enter some text first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          mode,
          section,
          resumeId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.quota && onQuotaUpdate) {
          onQuotaUpdate(data.quota);
        }
        throw new Error(data.error || "Rewrite failed");
      }

      onApply(data.text || "");

      if (data?.quota && onQuotaUpdate) {
        onQuotaUpdate(data.quota);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Rewrite failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleRewrite("professional")}
        disabled={loading}
        className="rounded-lg border border-brand-600 px-3 py-2 text-xs font-medium text-brand-600 disabled:opacity-50"
      >
        {loading ? "Rewriting..." : "AI Rewrite"}
      </button>
      <button
        type="button"
        onClick={() => handleRewrite("concise")}
        disabled={loading}
        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 disabled:opacity-50"
      >
        Make Concise
      </button>
    </div>
  );
}
