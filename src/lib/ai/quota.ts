import { createAdminClient } from "@/lib/supabase/admin";

export type UserPlan = "free" | "pro";

export type AIQuotaStatus = {
  plan: UserPlan;
  used: number;
  limit: number | null;
  remaining: number | null;
};

const FREE_MONTHLY_LIMIT = 10;

function getMonthRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const admin = createAdminClient();

  const { data } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  return data?.plan === "pro" ? "pro" : "free";
}

export async function getAIQuotaStatus(userId: string): Promise<AIQuotaStatus> {
  const admin = createAdminClient();
  const plan = await getUserPlan(userId);

  if (plan === "pro") {
    return {
      plan,
      used: 0,
      limit: null,
      remaining: null,
    };
  }

  const { start, end } = getMonthRange();

  const { count } = await admin
    .from("ai_usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "ai_rewrite")
    .eq("success", true)
    .gte("created_at", start)
    .lt("created_at", end);

  const used = count ?? 0;
  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - used);

  return {
    plan,
    used,
    limit: FREE_MONTHLY_LIMIT,
    remaining,
  };
}

export async function canUseAIRewrite(userId: string) {
  const quota = await getAIQuotaStatus(userId);

  if (quota.plan === "pro") {
    return { allowed: true, quota };
  }

  if ((quota.remaining ?? 0) <= 0) {
    return { allowed: false, quota };
  }

  return { allowed: true, quota };
}

export async function logAIUsageEvent(params: {
  userId: string;
  success: boolean;
  blockedReason?: string | null;
  inputText?: string | null;
}) {
  const admin = createAdminClient();

  await admin.from("ai_usage_events").insert({
    user_id: params.userId,
    event_type: "ai_rewrite",
    success: params.success,
    blocked_reason: params.blockedReason ?? null,
    input_text: params.inputText ?? null,
  });
}
