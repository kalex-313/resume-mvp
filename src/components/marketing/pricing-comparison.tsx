export function PricingComparison() {
  const rows = [
    ["Resume builder", "Yes", "Yes"],
    ["Template library", "Core templates", "All templates"],
    ["AI rewrite", "10 / month", "Unlimited"],
    ["PDF export", "Locked", "Unlocked"],
    ["Premium layouts", "No", "Yes"]
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan comparison</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Know exactly what unlocks with Pro</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="py-3 pr-4 font-medium text-slate-500">Feature</th>
              <th className="py-3 pr-4 font-medium text-slate-500">Free</th>
              <th className="py-3 font-medium text-slate-500">Pro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-700">{row[0]}</td>
                <td className="py-3 pr-4 text-slate-600">{row[1]}</td>
                <td className="py-3 font-medium text-slate-900">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
