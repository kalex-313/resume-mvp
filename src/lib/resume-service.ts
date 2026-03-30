import { createClient } from "@/lib/supabase/server";
import type { ResumeRecord } from "@/types/resume";

export async function getUserResumes(userId: string): Promise<ResumeRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ResumeRecord[];
}

export async function getResumeById(id: string, userId: string): Promise<ResumeRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", id).eq("user_id", userId).single();
  if (error) return null;
  return data as ResumeRecord;
}
