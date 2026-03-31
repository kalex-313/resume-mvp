import Stripe from "stripe";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function toIso(seconds) {
  if (!seconds) return null;
  return new Date(seconds * 1000).toISOString();
}

function getSubscriptionPeriodEnd(subscription) {
  const raw = subscription.current_period_end || null;
  return toIso(raw);
}

export async function POST(request) {
  const stripe = getStripeServer();
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    await admin.from("profiles").update({
      current_period_end: getSubscriptionPeriodEnd(subscription),
    }).eq("stripe_customer_id", customerId);
  }

  return new Response("ok");
}
