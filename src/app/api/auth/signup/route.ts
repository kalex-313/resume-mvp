import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const SIGNUP_SUCCESS_MESSAGE =
  "If this email can receive RoleArc account messages, we will send the next signup step shortly.";
const signupRateLimitResponse = rateLimitResponse(
  "Too many signup attempts. Please wait a few minutes and try again."
);

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit({
    action: "auth:signup",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return signupRateLimitResponse(rateLimit);
  }

  const body = await request.json();

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const fullName = String(body.fullName || "").trim();
  const redirectTo =
    String(body.redirectTo || "").trim() ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json(
      {
        ok: true,
        message: SIGNUP_SUCCESS_MESSAGE,
      },
      { status: 200 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    if (error.message?.toLowerCase().includes("already")) {
      return NextResponse.json({
        ok: true,
        message: SIGNUP_SUCCESS_MESSAGE,
      });
    }

    return NextResponse.json(
      {
        error: error.message || "Signup failed.",
        code: "SIGNUP_FAILED",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: SIGNUP_SUCCESS_MESSAGE,
  });
}
