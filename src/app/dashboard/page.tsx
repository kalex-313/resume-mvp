import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DeleteResumeButton } from "@/components/dashboard/delete-resume-button";
import { createResumeAction } from "./actions";
import type { ResumeRecord } from "@/types/resume";

function formatUpdatedAt(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, user_id, title, template_id, content_json, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load resumes");
  }

  const safeResumes = (resumes || []) as ResumeRecord[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Your resumes
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create, manage, and continue editing your saved resumes.
            </p>
          </div>

          <form action={createResumeAction}>
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Create New Resume
            </button>
          </form>
        </div>

        {safeResumes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No resumes yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start your first resume to see it here.
            </p>

            <form action={createResumeAction} className="mt-5">
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
              >
                Create your first resume
              </button>
            </form>
          </div>
        ) : (
          <div className="grid gap-4">
            {safeResumes.map((resume) => (
              <div
                key={resume.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {resume.title || "Untitled Resume"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Template: {resume.template_id || "professional-blue"} · Updated:{" "}
                      {formatUpdatedAt(resume.updated_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/builder/${resume.id}`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700"
                    >
                      Edit resume
                    </Link>

                    <DeleteResumeButton resumeId={resume.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
