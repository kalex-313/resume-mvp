
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAIQuotaStatus } from "@/lib/ai/quota";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quota = await getAIQuotaStatus(user.id);
  return NextResponse.json({ quota });
}
