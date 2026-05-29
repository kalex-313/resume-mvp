import { TrackLink } from "@/components/analytics/track-link";

export function SampleResumePreview({
  isLoggedIn = false,
  source = "sample_resume_preview",
}: {
  isLoggedIn?: boolean;
  source?: string;
}) {
  return (
    <section
      id="sample-resume-preview"
      aria-label="Sample RoleArc resume preview"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
            Preview before signup
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            See the kind of resume RoleArc helps you finish
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Visitors should not have to guess what they get. This sample shows the cleaner structure, stronger wording,
            and export-ready style RoleArc is built around.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TrackLink
              href={isLoggedIn ? "/dashboard" : "/auth/signup"}
              eventName={isLoggedIn ? "dashboard_click" : "sign_up_click"}
              eventParams={{ source }}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
            >
              {isLoggedIn ? "Open Dashboard" : "Create my resume free"}
            </TrackLink>
            <TrackLink
              href="/templates"
              eventName="template_gallery_click"
              eventParams={{ source }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View templates
            </TrackLink>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-slate-950">Maya Chen</h3>
              <p className="mt-1 text-sm text-slate-600">Customer Support Specialist | Vancouver, BC</p>
              <p className="mt-2 text-xs text-slate-500">maya@example.com | LinkedIn | 555-0108</p>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Summary</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Customer support specialist with experience resolving order issues, improving response consistency,
                  and supporting daily service operations in fast-paced retail environments.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Experience</p>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-slate-900">Support Associate, Northline Retail</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    <li>Handled 40+ customer inquiries per day across order status, returns, and product questions.</li>
                    <li>Created clearer response notes that helped the team resolve repeat issues more consistently.</li>
                    <li>Assisted with inventory checks to reduce avoidable customer follow-up delays.</li>
                  </ul>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Skills</p>
                  <p className="mt-2 text-sm text-slate-700">Customer service, Excel, order support, inventory tracking</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Education</p>
                  <p className="mt-2 text-sm text-slate-700">Business Administration Certificate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
