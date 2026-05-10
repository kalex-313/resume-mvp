"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function CheckoutForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action="/api/stripe/create-checkout"
      method="POST"
      onSubmit={() => {
        setSubmitting(true);
        trackEvent("start_checkout", {
          plan: "pro",
          billing_period: "monthly",
          source: "upgrade_page",
        });
      }}
    >
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-brand-600 px-6 py-3 text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Opening checkout..." : "Continue to Payment"}
      </button>
    </form>
  );
}
