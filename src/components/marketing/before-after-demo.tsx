export function BeforeAfterDemo() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Before AI rewrite</p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-5">
          <p className="text-sm leading-7 text-slate-600">
            Helped customers with orders and answered questions. Worked with team and did inventory tasks.
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">After AI rewrite</p>
        <div className="mt-4 rounded-2xl bg-brand-50 p-5">
          <p className="text-sm leading-7 text-slate-700">
            Supported customer order inquiries, collaborated with team members to maintain smooth daily operations,
            and assisted with inventory tracking to improve stock accuracy and service consistency.
          </p>
        </div>
      </div>
    </section>
  );
}
