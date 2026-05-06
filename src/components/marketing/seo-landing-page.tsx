import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TrackLink } from "@/components/analytics/track-link";

type LandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta?: string;
  proofPoints: string[];
  sections: Array<{
    title: string;
    body: string;
    items: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

const relatedPages = [
  { href: "/ai-resume-builder", label: "AI Resume Builder" },
  { href: "/ats-resume-templates", label: "ATS Resume Templates" },
  { href: "/resume-builder-canada", label: "Resume Builder for Canada" },
  { href: "/student-resume-builder", label: "Student Resume Builder" },
  { href: "/career-change-resume-builder", label: "Career Change Resume Builder" },
  { href: "/entry-level-resume-builder", label: "Entry Level Resume Builder" },
  { href: "/resume-pdf-export", label: "Resume PDF Export" },
];

export function SeoLandingPage({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta = "Compare plans",
  proofPoints,
  sections,
  faqs,
}: LandingPageProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackLink
                href="/auth/signup"
                eventName="sign_up_click"
                eventParams={{ source: "seo_landing_page", page_title: title }}
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white"
              >
                {primaryCta}
              </TrackLink>
              <Link
                href="/pricing"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                {secondaryCta}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div id="resume-preview-export" className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="h-4 w-40 rounded bg-slate-300" />
                  <div className="mt-3 h-3 w-56 rounded bg-slate-200" />
                </div>
                <div className="h-3 w-24 rounded bg-brand-200" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 h-3 w-24 rounded bg-brand-300" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-11/12 rounded bg-slate-200" />
                    <div className="h-3 w-4/5 rounded bg-slate-200" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-300" />
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-300" />
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 md:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Common questions</h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="font-medium text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-brand-600">Explore more resume builder paths</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Find the RoleArc page that matches your job search
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:border-brand-200 hover:text-brand-700"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
