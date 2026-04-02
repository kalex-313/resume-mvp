import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/ai/quota";
import { getResumeById } from "@/lib/resume-service";
import { ResumeEditor } from "@/components/builder/resume-editor";
import { QuotaBanner } from "@/components/common/quota-banner";

export const dynamic = "force-dynamic";

export default async function BuilderPage({
  params,
}: {
  params: { resumeId: string };
}) {
  const { resumeId } = params;
  const user = await requireUser();
  const resume = await getResumeById(resumeId, user.id);

  if (!resume) notFound();

  const plan = await getUserPlan(user.id);

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("cancel_at_period_end, current_period_end")
    .eq("id", user.id)
    .maybeSingle();

  const scheduledCancellation =
    !!profile?.cancel_at_period_end &&
    !!profile?.current_period_end &&
    new Date(profile.current_period_end).getTime() > Date.now();

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4">
          <QuotaBanner />
        </div>

        <ResumeEditor
          resume={resume}
          initialPlan={plan}
          scheduledCancellation={scheduledCancellation}
          currentPeriodEnd={profile?.current_period_end ?? null}
        />
      </main>
    </div>
  );
}
