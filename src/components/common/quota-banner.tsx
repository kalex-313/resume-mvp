
"use client";

import { useEffect, useState } from "react";

export function QuotaBanner() {
  const [quota, setQuota] = useState<any>(null);

  useEffect(() => {
    fetch("/api/ai/quota")
      .then((res) => res.json())
      .then((data) => setQuota(data.quota));
  }, []);

  if (!quota || quota.plan === "pro") return null;

  return (
    <div className="mb-3 text-xs text-gray-600">
      Free plan: {quota.used} / {quota.limit} AI rewrites used
    </div>
  );
}
