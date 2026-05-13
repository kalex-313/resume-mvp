import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const helpfulLinks = [
  { href: "/", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-resume-builder", label: "AI Resume Builder" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
          Page not found
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          This page is not available
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          The link may be old, moved, or typed incorrectly. You can continue from one of the main RoleArc pages.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {helpfulLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
