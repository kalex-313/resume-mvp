
"use client";

import { useRouter } from "next/navigation";

export function UpgradeCTA({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
      <div className="font-medium text-blue-900">
        {message || "You’ve reached the free limit."}
      </div>
      <div className="mt-2 text-blue-700">
        Upgrade to Pro for unlimited AI rewrites and full features.
      </div>
      <button
        onClick={() => router.push("/upgrade")}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Upgrade Now
      </button>
    </div>
  );
}
