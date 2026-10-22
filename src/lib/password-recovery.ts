import type { SupabaseClient } from "@supabase/supabase-js";

export const RECOVERY_LINK_ERROR =
  "This password reset link is invalid, expired, or was opened in a different browser. Request a new link and open it in the same browser where you requested it.";

type RecoveryAuth = Pick<SupabaseClient["auth"], "getSession" | "getUser" | "setSession" | "verifyOtp">;

// Capture the URL before SDK initialization, which may consume and remove a
// single-use PKCE code. Await initialization; never exchange that code twice.
export async function initializePasswordRecovery(auth: RecoveryAuth, url: URL) {
  const hash = new URLSearchParams(url.hash.slice(1));
  if (url.searchParams.has("error") || hash.has("error") || hash.has("error_code")) {
    throw new Error(RECOVERY_LINK_ERROR);
  }

  await auth.getSession();
  const tokenHash = url.searchParams.get("token_hash");
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");

  if (tokenHash) {
    if (url.searchParams.get("type") !== "recovery") throw new Error(RECOVERY_LINK_ERROR);
    const { error } = await auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error) throw new Error(RECOVERY_LINK_ERROR);
  } else if (accessToken || refreshToken) {
    // Legacy implicit links need explicit installation with the PKCE SSR client.
    if (!accessToken || !refreshToken || hash.get("type") !== "recovery") {
      throw new Error(RECOVERY_LINK_ERROR);
    }
    const { error } = await auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    if (error) throw new Error(RECOVERY_LINK_ERROR);
  }

  // Validate with Auth rather than trusting local session storage alone.
  const { data, error } = await auth.getUser();
  if (error || !data.user) throw new Error(RECOVERY_LINK_ERROR);
}

export function clearRecoveryParameters(url: URL) {
  const clean = new URL(url);
  for (const key of ["code", "token_hash", "type", "error", "error_code", "error_description"]) {
    clean.searchParams.delete(key);
  }
  clean.hash = "";
  return clean.pathname + clean.search;
}
