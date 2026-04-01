import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe";

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
