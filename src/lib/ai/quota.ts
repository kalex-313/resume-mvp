import { createClient } from "@/lib/supabase/server";
import { FREE_AI_REWRITE_LIMIT, type UserPlan } from "@/lib/plan";

type ProfilePlanRow = {
  plan: string | null;
  subscription_status?: string | null;
  cancel_at_period_end?: boolean | null;
  current_period_end?: string | null;
};

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("plan, subscription_status, cancel_at_period_end, current_period_end")
    .eq("id", userId)
    .maybeSingle<ProfilePlanRow>();

  if (error || !data) return "free";

  const now = new Date();
  const periodEnd = data.current_period_end ? new Date(data.current_period_end) : null;

  const hasPaidAccess =
    data.plan === "pro" &&
    (
      data.subscription_status === "active" ||
      data.subscription_status === "trialing" ||
      (
        data.cancel_at_period_end === true &&
        periodEnd !== null &&
        periodEnd.getTime() > now.getTime()
      )
    );

  return hasPaidAccess ? "pro" : "free";
}

export async function getCurrentMonthAiUsageCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString();

  const { count, error } = await supabase
    .from("ai_usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart);

  if (error) return 0;
  return count ?? 0;
}

export async function getAiQuotaStatus(userId: string) {
  const plan = await getUserPlan(userId);

  if (plan === "pro") {
    return {
      plan,
      used: 0,
      limit: null,
      remaining: null,
      allowed: true
    };
  }

  const used = await getCurrentMonthAiUsageCount(userId);
  const remaining = Math.max(0, FREE_AI_REWRITE_LIMIT - used);

  return {
    plan,
    used,
    limit: FREE_AI_REWRITE_LIMIT,
    remaining,
    allowed: remaining > 0
  };
}

export async function recordAiUsageEvent(userId: string, actionType: string, resumeId?: string | null) {
  const supabase = await createClient();

  await supabase.from("ai_usage_events").insert({
    user_id: userId,
    resume_id: resumeId || null,
    action_type: actionType
  });
}
