export function SocialProofStrip() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Built for</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">ATS + recruiter readability</p>
          <p className="mt-1 text-sm text-slate-600">Templates are designed for clean scanning and practical hiring workflows.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Made faster with</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">AI-assisted rewriting</p>
          <p className="mt-1 text-sm text-slate-600">Turn rough bullets into stronger, clearer resume language in seconds.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Export ready</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Professional PDF output</p>
          <p className="mt-1 text-sm text-slate-600">Move from draft to a polished export without leaving the builder.</p>
        </div>
      </div>
    </section>
  );
}
