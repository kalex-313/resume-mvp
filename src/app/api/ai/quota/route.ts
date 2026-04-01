import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAIQuotaStatus } from "@/lib/ai/quota";

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();

  if (userError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quota = await getAIQuotaStatus(authData.user.id);
  return NextResponse.json(quota);
}
