import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;
  const body = await request.json();

  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();

  if (userError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .update({
      title: body.title,
      template_id: body.template_id,
      content_json: body.content_json,
      updated_at: new Date().toISOString()
    })
    .eq("id", resumeId)
    .eq("user_id", authData.user.id)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/dashboard");
  revalidatePath(`/builder/${resumeId}`);
  return NextResponse.json({ id: data.id, ok: true });
}
