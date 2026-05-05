import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function isStripeTestMode() {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;
}

export function isProductionSite() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  return process.env.NODE_ENV === "production" && /https:\/\/(www\.)?rolearc\.xyz\/?$/i.test(siteUrl);
}

export function canUseTestCheckout(email: string | null | undefined) {
  if (!isStripeTestMode() || !isProductionSite()) {
    return true;
  }

  const allowedEmails = (process.env.STRIPE_TEST_CHECKOUT_ALLOWLIST || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return !!email && allowedEmails.includes(email.toLowerCase());
}

export function getStripeServer() {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  stripeInstance = new Stripe(secretKey);

  return stripeInstance;
}
