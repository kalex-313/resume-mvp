import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "AI Resume Builder | RoleArc",
  description:
    "Build a job-ready resume with AI rewrite, clean templates, and polished PDF export in RoleArc.",
  alternates: {
    canonical: "/ai-resume-builder",
  },
};

export default function AiResumeBuilderPage() {
  return (
    <SeoLandingPage
      eyebrow="AI resume builder"
      title="Build a stronger resume with AI that keeps your experience honest"
      description="RoleArc helps you turn rough resume notes into clearer summaries, stronger bullets, and a cleaner job application without inventing claims you cannot support."
      primaryCta="Build my resume free"
      proofPoints={["AI rewrite", "Clean templates", "PDF export"]}
      sections={[
        {
          title: "Rewrite weak bullets",
          body: "Improve wording that sounds vague, passive, or too informal.",
          items: ["Sharper action verbs", "Cleaner sentence structure", "Same-language rewriting"],
        },
        {
          title: "Stay application-ready",
          body: "Keep your resume organized while you edit, save drafts, and compare layouts.",
          items: ["Structured sections", "Template switching", "Autosave workflow"],
        },
        {
          title: "Export with confidence",
          body: "When your resume is ready, export a polished PDF for applications.",
          items: ["Professional PDF output", "ATS-friendly layouts", "Premium export on Pro"],
        },
      ]}
      faqs={[
        {
          question: "Can AI write my whole resume for me?",
          answer:
            "RoleArc is designed to improve the material you provide. You should review every suggestion and keep only details that truthfully match your experience.",
        },
        {
          question: "Does RoleArc work for English and Chinese resumes?",
          answer:
            "Yes. RoleArc supports English, Chinese, and bilingual resume content, and AI rewrite aims to keep the same language as your input.",
        },
        {
          question: "Can I start without paying?",
          answer:
            "Yes. You can start with the free plan, build resumes, save drafts, and try limited AI rewrites before upgrading.",
        },
      ]}
    />
  );
}
