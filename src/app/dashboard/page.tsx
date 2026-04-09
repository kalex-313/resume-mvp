import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { ResumeContent, ResumeRecord } from "@/types/resume";

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

  async function createResumeAction() {
    "use server";

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

  async function deleteResumeAction(formData: FormData) {
    "use server";

    const resumeId = String(formData.get("resumeId") || "");

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

    redirect("/dashboard");
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

                    <form
                      action={deleteResumeAction}
                      onSubmit={(event) => {
                        const ok = window.confirm(
                          "Delete this resume? This action cannot be undone."
                        );

                        if (!ok) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="resumeId" value={resume.id} />
                      <button
                        type="submit"
                        className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600"
                      >
                        Delete
                      </button>
                    </form>
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
