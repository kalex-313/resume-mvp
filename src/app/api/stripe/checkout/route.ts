import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canUseTestCheckout, getStripeServer } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const checkoutRateLimitResponse = rateLimitResponse(
  "Too many checkout attempts. Please wait a few minutes and try again."
);

export async function POST() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canUseTestCheckout(authData.user.email)) {
    return NextResponse.json(
      { error: "Stripe test checkout is restricted on the production site." },
      { status: 403 }
    );
  }

  const rateLimit = await checkRateLimit({
    action: "stripe:checkout",
    limit: 10,
    windowMs: 15 * 60 * 1000,
    userId: authData.user.id,
  });

  if (!rateLimit.allowed) {
    return checkoutRateLimitResponse(rateLimit);
  }

  const stripe = getStripeServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const priceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;

  if (!priceId) {
    return NextResponse.json(
      { error: "Missing STRIPE_PRICE_ID_PRO_MONTHLY in environment variables." },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: authData.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    metadata: {
      user_id: authData.user.id
    },
    success_url: `${siteUrl}/pricing?upgrade=success`,
    cancel_url: `${siteUrl}/pricing?upgrade=cancelled`
  });

  return NextResponse.json({ url: session.url });
}
