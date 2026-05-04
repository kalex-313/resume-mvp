export function ATSFriendlyNote() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">What does ATS-friendly mean?</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        ATS stands for Applicant Tracking System, the software many employers use to scan,
        store, and search resumes before a recruiter reads them.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-900">ATS-friendly usually means:</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>Clear section titles like Summary, Experience, Education, and Skills</li>
            <li>Simple formatting that keeps text easy to read and parse</li>
            <li>Relevant job keywords that match the role you are applying for</li>
            <li>Clean PDF output without decorative clutter</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">How RoleArc helps:</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>Templates keep structure clean and recruiter-friendly</li>
            <li>AI rewrite improves clarity without adding fake claims</li>
            <li>Sections stay organized for faster review by recruiters</li>
            <li>Pro export produces a polished final resume PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
