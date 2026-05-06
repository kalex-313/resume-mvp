import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "Resume PDF Export | RoleArc",
  description:
    "Create and export a polished resume PDF from RoleArc after improving your wording and choosing a clean template.",
  alternates: {
    canonical: "/resume-pdf-export",
  },
};

export default function ResumePdfExportPage() {
  return (
    <SeoLandingPage
      eyebrow="Resume PDF export"
      title="Turn your finished resume into a clean, application-ready PDF"
      description="RoleArc helps you draft, refine, preview, and export a professional resume PDF so you can send applications with less friction."
      primaryCta="Create a resume PDF"
      proofPoints={["Live preview", "Professional PDF", "Pro export"]}
      sections={[
        {
          title: "Preview before export",
          body: "Review how your resume looks before downloading the final file.",
          items: ["Live resume preview", "Template comparison", "Cleaner formatting"],
        },
        {
          title: "Prepare application files",
          body: "Export a polished PDF that is easier to share with employers and recruiters.",
          items: ["PDF download", "Professional file output", "Readable layout"],
        },
        {
          title: "Improve before sending",
          body: "Use AI rewrite and templates before exporting so your final PDF reads better.",
          items: ["Stronger summaries", "Sharper bullets", "ATS-friendly structure"],
        },
      ]}
      faqs={[
        {
          question: "Is PDF export free?",
          answer:
            "You can build and save resumes on the free plan. Professional PDF export is part of RoleArc Pro.",
        },
        {
          question: "Can I edit my resume after exporting?",
          answer:
            "Yes. You can return to the builder, update your content, save the draft, and export another PDF.",
        },
        {
          question: "Why export as PDF?",
          answer:
            "PDF is widely accepted for job applications and helps preserve your resume layout when recruiters open or share it.",
        },
      ]}
    />
  );
}
