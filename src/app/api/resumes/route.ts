import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const createResumeRateLimitResponse = rateLimitResponse(
  "Too many resume creation attempts. Please wait a few minutes and try again."
);

export async function POST() {
  const supabase = await createClient();
  const { data: authData, error: userError } = await supabase.auth.getUser();

  if (userError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await checkRateLimit({
    action: "resume:create",
    limit: 30,
    windowMs: 15 * 60 * 1000,
    userId: authData.user.id,
  });

  if (!rateLimit.allowed) {
    return createResumeRateLimitResponse(rateLimit);
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
