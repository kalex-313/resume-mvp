import crypto from "crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const AI_RATE_LIMIT_PER_MINUTE = 5;
export const AI_RATE_LIMIT_PER_DAY = 30;

export function hashIp(input: string | null) {
  if (!input) return null;
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function getRequestContext() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");
  const userAgent = h.get("user-agent");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || null;

  return {
    ipHash: hashIp(ip),
    userAgent: userAgent || ""
  };
}

export async function countRecentUserRequests(userId: string, minutes: number) {
  const supabase = await createClient();
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("ai_request_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) return 0;
  return count ?? 0;
}

export async function countRecentIpRequests(ipHash: string | null, minutes: number) {
  if (!ipHash) return 0;

  const supabase = await createClient();
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("ai_request_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) return 0;
  return count ?? 0;
}

export async function countDailyUserRequests(userId: string) {
  const supabase = await createClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("ai_request_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) return 0;
  return count ?? 0;
}

export async function logAiRequest(userId: string, actionType: string, ipHash: string | null, userAgent: string) {
  const supabase = await createClient();

  await supabase.from("ai_request_logs").insert({
    user_id: userId,
    ip_hash: ipHash,
    user_agent: userAgent,
    action_type: actionType
  });
}

export async function checkAiRateLimit(userId: string) {
  const { ipHash, userAgent } = await getRequestContext();

  const [userMinuteCount, ipMinuteCount, userDailyCount] = await Promise.all([
    countRecentUserRequests(userId, 1),
    countRecentIpRequests(ipHash, 1),
    countDailyUserRequests(userId)
  ]);

  const minuteAllowed =
    userMinuteCount < AI_RATE_LIMIT_PER_MINUTE &&
    ipMinuteCount < AI_RATE_LIMIT_PER_MINUTE * 2;

  const dailyAllowed = userDailyCount < AI_RATE_LIMIT_PER_DAY;

  return {
    allowed: minuteAllowed && dailyAllowed,
    minuteAllowed,
    dailyAllowed,
    ipHash,
    userAgent,
    stats: {
      userMinuteCount,
      ipMinuteCount,
      userDailyCount,
      perMinuteLimit: AI_RATE_LIMIT_PER_MINUTE,
      perDayLimit: AI_RATE_LIMIT_PER_DAY
    }
  };
}
