"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function CreateResumeButton({
  label = "Create New Resume",
  source = "dashboard",
}: {
  label?: string;
  source?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    trackEvent("resume_create_click", { source });
    try {
      const response = await fetch("/api/resumes", { method: "POST" });
      if (!response.ok) throw new Error("Failed to create resume");
      const data = await response.json();
      trackEvent("resume_create_success", {
        source,
        first_resume_email_status: data?.firstResumeEmail?.status || "unknown",
      });
      router.push(`/builder/${data.id}`);
      router.refresh();
    } catch {
      trackEvent("resume_create_failed", { source });
      alert("Could not create resume.");
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCreate} disabled={loading} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
      {loading ? "Creating..." : label}
    </button>
  );
}
