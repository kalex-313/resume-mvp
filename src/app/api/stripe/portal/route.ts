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

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customerId = profile?.stripe_customer_id;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!customerId || !siteUrl) {
    return NextResponse.redirect(new URL("/pricing", siteUrl || "http://localhost:3000"), {
      status: 303,
    });
  }

  const stripe = getStripeServer();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/pricing`,
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
