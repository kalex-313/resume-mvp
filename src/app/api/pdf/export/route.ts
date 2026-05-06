
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/ai/quota";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const pdfExportRateLimitResponse = rateLimitResponse(
  "Too many PDF export checks. Please wait a few minutes and try again."
);

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await checkRateLimit({
    action: "pdf:export",
    limit: 30,
    windowMs: 15 * 60 * 1000,
    userId: user.id,
  });

  if (!rateLimit.allowed) {
    return pdfExportRateLimitResponse(rateLimit);
  }

  const plan = await getUserPlan(user.id);

  if (plan !== "pro") {
    return NextResponse.json(
      {
        error: "PDF export is available on the Pro plan.",
        code: "PDF_LOCKED",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
