import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TemplateCatalogGrid } from "@/components/templates/template-catalog";
import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/ai/quota";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const userPlan = user ? await getUserPlan(user.id) : "free";

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Resume template gallery
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Choose the right template before you write</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Compare clean, ATS-friendly, premium, and role-specific resume layouts before creating your account.
            This makes the product feel more real and helps users understand what they are paying for.
          </p>
        </section>

        <section className="mt-8">
          <TemplateCatalogGrid isLoggedIn={!!user} userPlan={userPlan} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
