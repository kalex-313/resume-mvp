
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserPlan } from "@/lib/ai/quota";
import { isFreeTemplate } from "@/lib/templates";

type RouteParams = {
  params: Promise<{ resumeId: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const { resumeId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getUserPlan(user.id);
  const body = await request.json();

  const nextTemplateId = String(body.template_id || "professional-blue");

  if (plan === "free" && !isFreeTemplate(nextTemplateId)) {
    return NextResponse.json(
      {
        error: "This template is available on the Pro plan.",
        code: "PREMIUM_TEMPLATE_LOCKED",
      },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  const payload = {
    title: body.title,
    template_id: nextTemplateId,
    content_json: body.content_json,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin
    .from("resumes")
    .update(payload)
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
