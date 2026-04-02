
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  onQuotaUpdate?: (quota: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          router.push("/upgrade");
        } else {
          alert(data?.error || "AI rewrite failed.");
        }
        onQuotaUpdate?.(data?.quota || null);
        return;
      }

      if (typeof data.text === "string") {
        onApply(data.text);
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
