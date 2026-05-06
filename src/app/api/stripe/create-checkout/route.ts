import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canUseTestCheckout, getStripeServer } from "@/lib/stripe";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const checkoutRateLimitResponse = rateLimitResponse(
  "Too many checkout attempts. Please wait a few minutes and try again."
);

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL), {
      status: 303,
    });
  }

  if (!canUseTestCheckout(user.email)) {
    return NextResponse.redirect(
      new URL("/pricing?upgrade=test-mode-blocked", process.env.NEXT_PUBLIC_SITE_URL),
      { status: 303 }
    );
  }

  const rateLimit = await checkRateLimit({
    action: "stripe:create-checkout",
    limit: 10,
    windowMs: 15 * 60 * 1000,
    userId: user.id,
  });

  if (!rateLimit.allowed) {
    return checkoutRateLimitResponse(rateLimit);
  }

  const stripe = getStripeServer();
  const priceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!priceId || !siteUrl) {
    return NextResponse.json(
      { error: "Missing STRIPE_PRICE_ID_PRO_MONTHLY or NEXT_PUBLIC_SITE_URL" },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/pricing?upgrade=success`,
    cancel_url: `${siteUrl}/pricing?upgrade=cancelled`,
    customer_email: user.email ?? undefined,
    metadata: {
      user_id: user.id,
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
