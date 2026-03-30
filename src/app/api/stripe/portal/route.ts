import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeServer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", authData.user.id)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id || null;

  if (!customerId) {
    const customers = await stripe.customers.list({
      email: authData.user.email || undefined,
      limit: 1
    });
    customerId = customers.data[0]?.id || null;
  }

  if (!customerId) {
    return NextResponse.json({ error: "No Stripe customer found yet." }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/pricing`
  });

  return NextResponse.json({ url: session.url });
}
