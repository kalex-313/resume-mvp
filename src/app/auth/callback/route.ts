import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") || "/dashboard";
  let destination = new URL("/dashboard", requestUrl.origin);
  try {
    const candidate = new URL(requestedNext, requestUrl.origin);
    if (candidate.origin === requestUrl.origin) destination = candidate;
  } catch {
    // A malformed return URL must not prevent authentication.
  }
  const next = destination.origin === requestUrl.origin
    ? destination.pathname + destination.search
    : "/dashboard";
  const recovery = destination.pathname === "/auth/reset-password" && destination.origin === requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL(recovery ? "/auth/reset-password?error=invalid_link" : "/auth/login", requestUrl.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(recovery ? "/auth/reset-password?error=invalid_link" : "/auth/login?error=confirm_failed", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
