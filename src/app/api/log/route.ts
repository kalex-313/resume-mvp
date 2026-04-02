
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const admin = createAdminClient();

  await admin.from("ai_usage_events").insert({
    user_id: body.userId,
    event_type: body.eventType,
    success: true,
    blocked_reason: null,
  });

  return NextResponse.json({ ok: true });
}
