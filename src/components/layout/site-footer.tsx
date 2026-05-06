import Link from "next/link";

export function SiteFooter() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@rolearc.xyz";

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="RoleArc"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p>© 2026 RoleArc. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/ai-resume-builder" className="hover:text-slate-900">
            AI Resume Builder
          </Link>
          <Link href="/ats-resume-templates" className="hover:text-slate-900">
            ATS Templates
          </Link>
          <Link href="/resume-pdf-export" className="hover:text-slate-900">
            PDF Export
          </Link>
          <Link href="/resume-builder-canada" className="hover:text-slate-900">
            Canada
          </Link>
          <Link href="/student-resume-builder" className="hover:text-slate-900">
            Students
          </Link>
          <Link href="/career-change-resume-builder" className="hover:text-slate-900">
            Career Change
          </Link>
          <Link href="/entry-level-resume-builder" className="hover:text-slate-900">
            Entry Level
          </Link>
          <Link href="/pricing" className="hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/templates" className="hover:text-slate-900">
            Templates
          </Link>
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-900">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-slate-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
