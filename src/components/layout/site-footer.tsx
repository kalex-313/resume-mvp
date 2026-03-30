import Link from "next/link";

export function SiteFooter() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "ResumeReady";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-900">{companyName}</p>
          <p className="mt-1">Support: {supportEmail}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/templates" className="hover:text-slate-900">Templates</Link>
          <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
