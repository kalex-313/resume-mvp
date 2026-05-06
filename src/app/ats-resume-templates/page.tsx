import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "ATS Resume Templates | RoleArc",
  description:
    "Use clean ATS-friendly resume templates with simple sections, readable formatting, and polished PDF export.",
  alternates: {
    canonical: "/ats-resume-templates",
  },
};

export default function AtsResumeTemplatesPage() {
  return (
    <SeoLandingPage
      eyebrow="ATS resume templates"
      title="Choose resume templates built for clear scanning and recruiter review"
      description="RoleArc templates keep structure simple, sections predictable, and formatting clean so your resume is easier for hiring systems and recruiters to review."
      primaryCta="Browse resume templates"
      secondaryCta="See Pro features"
      proofPoints={["Clear sections", "Simple formatting", "Recruiter-friendly"]}
      sections={[
        {
          title: "Readable structure",
          body: "Use familiar resume sections that hiring teams expect to see.",
          items: ["Summary", "Experience", "Education", "Skills"],
        },
        {
          title: "Clean layouts",
          body: "Avoid over-designed resumes that distract from your experience.",
          items: ["Minimal spacing", "Strong hierarchy", "No decorative clutter"],
        },
        {
          title: "Better content flow",
          body: "Pair templates with AI rewrite to tighten summaries and bullet points.",
          items: ["Clearer wording", "Role-focused bullets", "Consistent tone"],
        },
      ]}
      faqs={[
        {
          question: "What makes a resume ATS-friendly?",
          answer:
            "ATS-friendly resumes usually use clear section titles, readable text, simple formatting, and relevant keywords that match the job description.",
        },
        {
          question: "Are all templates included on the free plan?",
          answer:
            "The free plan includes core templates. Premium layouts are available with RoleArc Pro.",
        },
        {
          question: "Can I switch templates after writing?",
          answer:
            "Yes. RoleArc is built so you can compare layouts while keeping your resume content organized.",
        },
      ]}
    />
  );
}
