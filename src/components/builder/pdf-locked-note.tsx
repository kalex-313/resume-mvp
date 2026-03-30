import Link from "next/link";

export function PDFLockedNote() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      PDF export is available on the Pro plan.
      <Link href="/pricing" className="ml-2 font-medium underline">
        View pricing
      </Link>
    </div>
  );
}
