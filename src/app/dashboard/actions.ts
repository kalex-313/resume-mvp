"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ResumeContent } from "@/types/resume";

function getDefaultContent(): ResumeContent {
  return {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [
      {
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: [""],
      },
    ],
    education: [
      {
        school: "",
        program: "",
        startDate: "",
        endDate: "",
        details: "",
      },
    ],
    skills: [],
    languages: [
      {
        name: "",
        level: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        year: "",
      },
    ],
  };
}

export async function createResumeAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "Untitled Resume",
      template_id: "professional-blue",
      content_json: getDefaultContent(),
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error("Could not create resume");
  }

  redirect(`/builder/${data.id}`);
}

export async function deleteResumeAction(resumeId: string) {
  if (!resumeId) {
    throw new Error("Missing resume id");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Could not delete resume");
  }

  revalidatePath("/dashboard");
}
