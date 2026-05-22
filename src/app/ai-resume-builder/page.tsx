import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "AI Resume Builder for Job-Ready Resumes | RoleArc",
  description:
    "Use RoleArc's AI resume builder to rewrite weak bullet points, organize your experience, choose ATS-friendly templates, and export a polished resume PDF.",
  alternates: {
    canonical: "/ai-resume-builder",
  },
  openGraph: {
    title: "AI Resume Builder for Job-Ready Resumes | RoleArc",
    description:
      "Rewrite weak resume bullets, organize your experience, and build a cleaner ATS-friendly resume before you apply.",
    url: "/ai-resume-builder",
  },
};

export default function AiResumeBuilderPage() {
  return (
    <SeoLandingPage
      eyebrow="AI resume builder"
      title="Build a stronger, ATS-friendly resume with AI"
      description="RoleArc helps job seekers turn rough resume notes into clearer summaries, stronger bullet points, and a cleaner application-ready resume without inventing claims you cannot support."
      primaryCta="Create my resume free"
      proofPoints={["AI bullet rewrite", "ATS-friendly templates", "Resume PDF export"]}
      sections={[
        {
          title: "Rewrite weak resume bullets",
          body: "Improve wording that sounds vague, passive, or too informal while keeping the facts under your control.",
          items: ["Sharper action verbs", "Clearer impact", "Same-language rewriting"],
        },
        {
          title: "Organize your experience",
          body: "Keep your resume structured while you edit contact details, summaries, work history, education, skills, and projects.",
          items: ["Structured resume sections", "Template switching", "Saved drafts"],
        },
        {
          title: "Export a clean resume PDF",
          body: "When your resume is ready, choose a clean layout and export a polished PDF for online applications.",
          items: ["Professional PDF output", "Readable layouts", "Premium export on Pro"],
        },
      ]}
      faqs={[
        {
          question: "Can an AI resume builder write my whole resume for me?",
          answer:
            "RoleArc is designed to improve the material you provide. You should review every suggestion and keep only details that truthfully match your experience.",
        },
        {
          question: "Is RoleArc an ATS-friendly resume builder?",
          answer:
            "RoleArc focuses on clean resume sections, readable layouts, and practical wording. That can make your resume easier for applicant tracking systems and recruiters to review, although no resume builder can guarantee screening results.",
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
