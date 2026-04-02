
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/ai/quota";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);

  if (plan !== "pro") {
    return NextResponse.json(
      {
        error: "PDF export is available on the Pro plan.",
        code: "PDF_LOCKED",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
