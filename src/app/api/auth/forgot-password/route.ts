import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

const forgotPasswordRateLimitResponse = rateLimitResponse(
  "Too many password reset requests. Please wait a few minutes and try again."
);

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const turnstileToken = String(body.turnstileToken || "");

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const rateLimit = await checkRateLimit({
    action: `auth:forgot-password:${email}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return forgotPasswordRateLimitResponse(rateLimit);
  }

  const turnstile = await verifyTurnstileToken(turnstileToken);

  if (!turnstile.ok) {
    return NextResponse.json(
      {
        error: "Verification failed. Please refresh the page and try again.",
        code: "TURNSTILE_FAILED",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Could not send reset email." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Check your email for the password reset link.",
  });
}
