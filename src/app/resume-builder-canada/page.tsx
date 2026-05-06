import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "Resume Builder for Canada | RoleArc",
  description:
    "Create a clean Canadian resume with RoleArc's AI rewrite, ATS-friendly templates, and professional PDF export.",
  alternates: {
    canonical: "/resume-builder-canada",
  },
};

export default function ResumeBuilderCanadaPage() {
  return (
    <SeoLandingPage
      eyebrow="Resume builder for Canada"
      title="Build a cleaner resume for Canadian job applications"
      description="RoleArc helps job seekers in Canada organize experience, improve resume wording, and export a polished PDF for online applications."
      primaryCta="Create my Canadian resume"
      proofPoints={["ATS-friendly", "Clear layout", "PDF export"]}
      sections={[
        {
          title: "Fit common hiring workflows",
          body: "Many Canadian employers use online portals and screening systems before a recruiter reviews your resume.",
          items: ["Clear section names", "Readable formatting", "Relevant role keywords"],
        },
        {
          title: "Write with stronger clarity",
          body: "Turn rough experience notes into resume-ready summaries and bullet points.",
          items: ["Better action verbs", "Concise achievements", "Professional tone"],
        },
        {
          title: "Prepare a polished PDF",
          body: "Export a clean resume file that is easy to upload and share.",
          items: ["Professional PDF", "Template preview", "Saved drafts"],
        },
      ]}
      faqs={[
        {
          question: "Can I use RoleArc for Canadian jobs?",
          answer:
            "Yes. RoleArc helps you create clean, practical resumes for Canadian job applications, while keeping your content focused on your real experience.",
        },
        {
          question: "Does RoleArc guarantee interviews?",
          answer:
            "No resume builder can guarantee interviews. RoleArc helps improve structure, clarity, and presentation so your resume is easier to review.",
        },
        {
          question: "Can I start free?",
          answer:
            "Yes. You can start free, build resumes, save drafts, and try limited AI rewrites before upgrading.",
        },
      ]}
    />
  );
}
