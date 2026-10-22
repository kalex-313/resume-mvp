import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Recovery emails use TokenHash, so opening a link in Safari from Gmail does
// not depend on a PKCE verifier cookie from the browser that requested it.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const destination = new URL("/auth/reset-password", url.origin);
  let verified = false;

  if (tokenHash && url.searchParams.get("type") === "recovery") {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
      verified = !error && !!data.session;
    } catch {
      // Do not log recovery URLs, tokens or provider responses.
    }
  }

  if (!verified) destination.searchParams.set("error", "invalid_link");
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
