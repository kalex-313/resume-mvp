import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
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
        error: "An account with this email already exists. Please log in instead.",
        code: "EMAIL_ALREADY_EXISTS",
      },
      { status: 409 }
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
    const message =
      error.message?.toLowerCase().includes("already")
        ? "An account with this email already exists. Please log in instead."
        : error.message;

    return NextResponse.json(
      {
        error: message || "Signup failed.",
        code: "SIGNUP_FAILED",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Check your email to confirm your account.",
  });
}
