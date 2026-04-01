import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe";
import { canUseAIRewrite, getAIQuotaStatus, logAIUsageEvent } from "@/lib/ai/quota";

export const dynamic = "force-dynamic";

function buildPrompt(text: string, section: string) {
  return `Rewrite the following ${section} content into stronger, professional resume language.
Keep it concise, truthful, and ATS-friendly.

Content:
${text}`;
}

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
  const section = String(body.section || "resume");

  if (!text) {
    return NextResponse.json({ error: "Missing text to rewrite." }, { status: 400 });
  }

  const gate = await canUseAIRewrite(user.id);

  if (!gate.allowed) {
    await logAIUsageEvent({
      userId: user.id,
      success: false,
      blockedReason: "free_quota_exhausted",
      inputText: text.slice(0, 500),
    });

    return NextResponse.json(
      {
        error: "You have used all free AI rewrites for this month. Upgrade to Pro for unlimited access.",
        code: "FREE_QUOTA_EXHAUSTED",
        quota: gate.quota,
      },
      { status: 403 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: buildPrompt(text, section) }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const rewritten =
      data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("")?.trim() || "";

    if (!response.ok || !rewritten) {
      await logAIUsageEvent({
        userId: user.id,
        success: false,
        blockedReason: "provider_error",
        inputText: text.slice(0, 500),
      });

      return NextResponse.json(
        { error: "AI rewrite failed. Please try again." },
        { status: 500 }
      );
    }

    await logAIUsageEvent({
      userId: user.id,
      success: true,
      inputText: text.slice(0, 500),
    });

    const quota = await getAIQuotaStatus(user.id);

    return NextResponse.json({
      text: rewritten,
      quota,
    });
  } catch {
    await logAIUsageEvent({
      userId: user.id,
      success: false,
      blockedReason: "request_failed",
      inputText: text.slice(0, 500),
    });

    return NextResponse.json(
      { error: "AI rewrite failed. Please try again." },
      { status: 500 }
    );
  }
}
