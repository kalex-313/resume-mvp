import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rewriteWithGemini } from "@/lib/ai/gemini";
import { getAiQuotaStatus, recordAiUsageEvent } from "@/lib/ai/quota";
import { checkAiRateLimit, logAiRequest } from "@/lib/ai/anti-abuse";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();

  if (userError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = String(body.text || "").trim();
  const mode = body.mode === "concise" ? "concise" : "professional";
  const section = body.section === "bullet" ? "bullet" : "summary";
  const resumeId = body.resumeId ? String(body.resumeId) : null;
  const actionType = section === "summary" ? `summary_${mode}` : `bullet_${mode}`;

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const quota = await getAiQuotaStatus(authData.user.id);

  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: "You have reached your monthly AI rewrite limit on the Free plan. Please upgrade to Pro.",
        quota
      },
      { status: 403 }
    );
  }

  const rateLimit = await checkAiRateLimit(authData.user.id);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: rateLimit.dailyAllowed
          ? "Too many AI rewrite requests right now. Please wait a minute and try again."
          : "You have reached the daily AI safety limit. Please try again later.",
        quota,
        rateLimit: rateLimit.stats
      },
      { status: 429 }
    );
  }

  try {
    const result = await rewriteWithGemini(text, mode, section);

    await Promise.all([
      recordAiUsageEvent(authData.user.id, actionType, resumeId),
      logAiRequest(authData.user.id, actionType, rateLimit.ipHash, rateLimit.userAgent)
    ]);

    const updatedQuota = await getAiQuotaStatus(authData.user.id);

    return NextResponse.json({
      ...result,
      quota: updatedQuota,
      rateLimit: rateLimit.stats
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
