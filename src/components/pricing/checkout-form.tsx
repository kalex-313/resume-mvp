"use client";

import { trackEvent } from "@/lib/analytics";

export function CheckoutForm() {
  return (
    <form
      action="/api/stripe/create-checkout"
      method="POST"
      onSubmit={() => {
        trackEvent("start_checkout", {
          plan: "pro",
          billing_period: "monthly",
          source: "upgrade_page",
        });
      }}
    >
      <button className="rounded-xl bg-brand-600 px-6 py-3 text-white hover:opacity-95">
        Continue to Payment
      </button>
    </form>
  );
}
