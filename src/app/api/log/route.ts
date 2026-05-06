
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const allowedEventTypes = new Set(["ai_rewrite"]);
const logRateLimitResponse = rateLimitResponse(
  "Too many log requests. Please wait a few minutes and try again."
);

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await checkRateLimit({
    action: "log:event",
    limit: 60,
    windowMs: 15 * 60 * 1000,
    userId: user.id,
  });

  if (!rateLimit.allowed) {
    return logRateLimitResponse(rateLimit);
  }

  const body = await req.json();
  const eventType = String(body.eventType || "");

  if (!allowedEventTypes.has(eventType)) {
    return NextResponse.json({ error: "Unsupported event type." }, { status: 400 });
  }

  const { error } = await supabase.from("ai_usage_events").insert({
    user_id: user.id,
    action_type: eventType,
  });

  if (error) {
    return NextResponse.json({ error: "Could not log event." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
