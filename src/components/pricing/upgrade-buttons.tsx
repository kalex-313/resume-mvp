"use client";

import { useState } from "react";

export function UpgradeButtons({ isPro }: { isPro: boolean }) {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  async function goToCheckout() {
    setLoadingCheckout(true);
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed";
      alert(message);
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function goToPortal() {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Portal failed");
      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Portal failed";
      alert(message);
    } finally {
      setLoadingPortal(false);
    }
  }

  if (isPro) {
    return (
      <button
        type="button"
        onClick={goToPortal}
        disabled={loadingPortal}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loadingPortal ? "Opening..." : "Manage Subscription"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={goToCheckout}
      disabled={loadingCheckout}
      className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {loadingCheckout ? "Opening..." : "Upgrade to Pro"}
    </button>
  );
}
