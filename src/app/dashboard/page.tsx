import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserResumes } from "@/lib/resume-service";
import { SiteHeader } from "@/components/layout/site-header";
import { CreateResumeButton } from "@/components/dashboard/create-resume-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const resumes = await getUserResumes(user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back, {user.email}</p>
          </div>
          <CreateResumeButton />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Your resumes</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {resumes.length > 0 ? resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-slate-900">{resume.title || "Untitled Resume"}</p>
                  <p className="mt-1 text-sm text-slate-500">Template: {resume.template_id} · Updated: {new Date(resume.updated_at).toLocaleString()}</p>
                </div>
                <Link href={`/builder/${resume.id}`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700">Edit</Link>
              </div>
            )) : <div className="px-6 py-10 text-sm text-slate-500">No resumes yet. Click “Create New Resume” to start.</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
