"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateResumeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    try {
      const response = await fetch("/api/resumes", { method: "POST" });
      if (!response.ok) throw new Error("Failed to create resume");
      const data = await response.json();
      router.push(`/builder/${data.id}`);
      router.refresh();
    } catch {
      alert("Could not create resume.");
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCreate} disabled={loading} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
      {loading ? "Creating..." : "Create New Resume"}
    </button>
  );
}
