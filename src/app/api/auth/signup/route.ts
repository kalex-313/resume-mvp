import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getRequestContext } from "@/lib/ai/anti-abuse";

const SIGNUP_RATE_LIMIT_WINDOW_MINUTES = 15;
const SIGNUP_RATE_LIMIT_PER_IP = 5;
const SIGNUP_SUCCESS_MESSAGE =
  "If this email can receive RoleArc account messages, we will send the next signup step shortly.";
const signupAttempts = new Map<string, number[]>();

function countRecentSignupAttempts(ipHash: string | null) {
  if (!ipHash) return 0;

  const since = Date.now() - SIGNUP_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;
  const attempts = signupAttempts.get(ipHash)?.filter((timestamp) => timestamp >= since) || [];
  signupAttempts.set(ipHash, attempts);

  return attempts.length;
}

function logSignupAttempt(ipHash: string | null) {
  if (!ipHash) return;

  const attempts = signupAttempts.get(ipHash) || [];
  attempts.push(Date.now());
  signupAttempts.set(ipHash, attempts);
}

export async function POST(request: Request) {
  const { ipHash } = await getRequestContext();
  const recentSignupAttempts = countRecentSignupAttempts(ipHash);

  if (recentSignupAttempts >= SIGNUP_RATE_LIMIT_PER_IP) {
    return NextResponse.json(
      {
        error: "Too many signup attempts. Please wait a few minutes and try again.",
        code: "SIGNUP_RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  logSignupAttempt(ipHash);

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
