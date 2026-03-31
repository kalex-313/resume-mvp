import Stripe from "stripe";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function toIso(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  return new Date(seconds * 1000).toISOString();
}

function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription & { current_period_end?: number }
): string | null {
  return toIso(subscription.current_period_end);
}

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing Stripe webhook configuration", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return new Response(message, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const customerId = typeof session.customer === "string" ? session.customer : null;

      if (!userId) {
        console.error("Stripe webhook: missing user_id metadata on checkout session.");
      } else {
        const { error } = await admin
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: customerId,
            subscription_status: "active",
            cancel_at_period_end: false,
          })
          .eq("id", userId);

        if (error) {
          console.error("Stripe webhook failed to upgrade user to pro:", error.message);
          return new Response("Failed to update plan", { status: 500 });
        }

        console.log("Stripe webhook upgraded user to pro:", userId);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription & {
        current_period_end?: number;
      };
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

      if (customerId) {
        const { error } = await admin
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: getSubscriptionPeriodEnd(subscription),
            plan:
              subscription.status === "active" || subscription.status === "trialing"
                ? "pro"
                : "free",
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Stripe webhook failed to sync subscription update:", error.message);
          return new Response("Failed to sync subscription update", { status: 500 });
        }

        console.log("Stripe webhook synced subscription update:", customerId);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription & {
        current_period_end?: number;
      };
      const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

      if (customerId) {
        const { error } = await admin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            cancel_at_period_end: false,
            current_period_end: getSubscriptionPeriodEnd(subscription),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Stripe webhook failed to downgrade user to free:", error.message);
          return new Response("Failed to update plan", { status: 500 });
        }

        console.log("Stripe webhook downgraded user to free:", customerId);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing error";
    console.error("Stripe webhook processing error:", message);
    return new Response(message, { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
