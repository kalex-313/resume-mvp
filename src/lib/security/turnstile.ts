import { headers } from "next/headers";

type TurnstileSiteverifyResponse = {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getAllowedHostnames() {
  return (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "rolearc.xyz,www.rolearc.xyz,localhost,127.0.0.1")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
}

export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");

  return forwarded?.split(",")[0]?.trim() || realIp || undefined;
}

export async function verifyTurnstileToken(token: string | null | undefined) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: true, enabled: false };
  }

  if (!token) {
    return { ok: false, enabled: true, reason: "missing-token" };
  }

  let response: Response;

  try {
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: await getClientIp(),
      }),
    });
  } catch {
    return { ok: false, enabled: true, reason: "siteverify-unreachable" };
  }

  if (!response.ok) {
    return { ok: false, enabled: true, reason: "siteverify-error" };
  }

  const result = (await response.json()) as TurnstileSiteverifyResponse;
  const hostname = result.hostname?.toLowerCase();
  const allowedHostnames = getAllowedHostnames();
  const hostnameAllowed = !hostname || allowedHostnames.includes(hostname);

  if (!result.success || !hostnameAllowed) {
    return {
      ok: false,
      enabled: true,
      reason: result["error-codes"]?.join(",") || "verification-failed",
    };
  }

  return { ok: true, enabled: true };
}
