
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  canUseAIRewrite,
  getAIQuotaStatus,
  logAIUsageEvent,
} from "@/lib/ai/quota";
import {
  buildRewritePrompt,
  type RewriteSection,
  type RewriteTone,
} from "@/lib/ai/prompt";
import { checkAiRateLimit, logAiRequest } from "@/lib/ai/anti-abuse";
import { rewriteWithAIProviders } from "@/lib/ai/providers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = String(body.text || "").trim();
  const section = String(body.section || "resume") as RewriteSection;
  const tone = String(body.tone || "balanced") as RewriteTone;
  const resumeId = body.resumeId ? String(body.resumeId) : null;

  if (!text) {
    return NextResponse.json({ error: "Missing text to rewrite." }, { status: 400 });
  }

  const rateLimit = await checkAiRateLimit(user.id);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: rateLimit.dailyAllowed
          ? "Too many AI rewrite requests. Please wait a minute and try again."
          : "You have reached today's AI rewrite safety limit. Please try again tomorrow.",
        code: rateLimit.dailyAllowed ? "AI_RATE_LIMITED" : "AI_DAILY_LIMITED",
      },
      { status: 429 }
    );
  }

  const gate = await canUseAIRewrite(user.id);

  if (!gate.allowed) {
    return NextResponse.json(
      {
        error: "You have used all free AI rewrites for this month. Upgrade to Pro for unlimited access.",
        code: "FREE_QUOTA_EXHAUSTED",
        quota: gate.quota,
      },
      { status: 403 }
    );
  }

  try {
    const prompt = buildRewritePrompt(text, section, tone);
    const rewritten = await rewriteWithAIProviders(prompt);

    await logAIUsageEvent({
      userId: user.id,
      resumeId,
      actionType: "ai_rewrite",
    });
    await logAiRequest(user.id, "ai_rewrite", rateLimit.ipHash, rateLimit.userAgent);

    const quota = await getAIQuotaStatus(user.id);

    return NextResponse.json({
      text: rewritten.text,
      quota,
      provider: rewritten.provider,
    });
  } catch {
    return NextResponse.json(
      { error: "AI rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
