import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getDefaultContent() {
  return {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: ""
    },
    summary: "",
    experience: [
      {
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [""]
      }
    ],
    education: [
      {
        school: "",
        program: "",
        startDate: "",
        endDate: "",
        details: ""
      }
    ],
    skills: []
  };
}

function getTemplateTitle(templateId: string) {
  switch (templateId) {
    case "minimal-clean":
      return "Minimal Clean Resume";
    case "ats-classic":
      return "ATS Classic Resume";
    case "modern-pro":
      return "Modern Pro Resume";
    case "minimal-pro":
      return "Minimal Pro Resume";
    case "tech-pro":
      return "Tech Pro Resume";
    default:
      return "Professional Blue Resume";
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const templateId = String(body.templateId || "professional-blue");

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: authData.user.id,
      title: getTemplateTitle(templateId),
      template_id: templateId,
      content_json: getDefaultContent()
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, ok: true });
}
