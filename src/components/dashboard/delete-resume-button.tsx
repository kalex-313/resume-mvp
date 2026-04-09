"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteResumeAction } from "@/app/dashboard/actions";

export function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const ok = window.confirm(
          "Delete this resume? This action cannot be undone."
        );

        if (!ok) return;

        startTransition(async () => {
          await deleteResumeAction(resumeId);
          router.refresh();
        });
      }}
      className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
