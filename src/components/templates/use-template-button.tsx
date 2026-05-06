"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function UseTemplateButton({
  templateId,
  isLoggedIn,
  locked = false,
}: {
  templateId: string;
  isLoggedIn: boolean;
  locked?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      trackEvent("sign_up_click", {
        source: "template_gallery",
        template_id: templateId,
      });
      router.push("/auth/signup");
      return;
    }

    if (locked) {
      router.push("/upgrade");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/resumes/from-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ templateId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create resume from template");
      }

      router.push(`/builder/${data.id}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create resume";
      alert(message);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
    >
      {loading ? "Opening..." : locked ? "Upgrade" : "Use template"}
    </button>
  );
}
