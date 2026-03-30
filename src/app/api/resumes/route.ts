import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();

  if (userError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: authData.user.id,
      title: "Untitled Resume",
      template_id: "professional-blue",
      language: "en",
      content_json: {
        personal: { fullName: "", email: "", phone: "", location: "", website: "", linkedin: "" },
        summary: "",
        experience: [{ company: "", role: "", location: "", startDate: "", endDate: "", bullets: [""] }],
        education: [{ school: "", program: "", startDate: "", endDate: "", details: "" }],
        skills: []
      }
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/dashboard");
  revalidatePath(`/builder/${data.id}`);

  return NextResponse.json({ id: data.id });
}
