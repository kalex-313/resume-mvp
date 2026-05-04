import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await admin.from("keep_alive_events").insert({
    checked_at: now,
    source: "vercel_cron",
  });

  if (error) {
    console.error("Supabase keep-alive failed:", error.message);
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase keep-alive failed.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    checkedAt: now,
  });
}
