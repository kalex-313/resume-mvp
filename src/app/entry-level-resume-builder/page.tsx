import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "Entry Level Resume Builder | RoleArc",
  description:
    "Build an entry level resume with stronger summaries, clearer bullets, clean templates, and professional PDF export.",
  alternates: {
    canonical: "/entry-level-resume-builder",
  },
};

export default function EntryLevelResumeBuilderPage() {
  return (
    <SeoLandingPage
      eyebrow="Entry level resume builder"
      title="Create a confident resume for your first serious role"
      description="RoleArc helps entry level applicants present early experience, projects, skills, and achievements in a cleaner, more professional resume."
      primaryCta="Build my entry level resume"
      proofPoints={["Early experience", "Skills", "Projects"]}
      sections={[
        {
          title: "Show useful experience",
          body: "Entry level resumes can include more than full-time jobs.",
          items: ["Internships", "Part-time roles", "Projects and coursework"],
        },
        {
          title: "Improve bullet points",
          body: "Turn basic task descriptions into clearer, more application-ready bullets.",
          items: ["Action verbs", "Specific outcomes", "Concise wording"],
        },
        {
          title: "Use a clean template",
          body: "Keep the layout simple so recruiters can quickly understand your strengths.",
          items: ["ATS-friendly sections", "Readable spacing", "PDF export"],
        },
      ]}
      faqs={[
        {
          question: "What should an entry level resume include?",
          answer:
            "Include education, relevant skills, internships, projects, part-time work, volunteering, and any achievements that support the role.",
        },
        {
          question: "How long should an entry level resume be?",
          answer:
            "Most entry level applicants should aim for a focused one-page resume unless they have a specific reason to include more.",
        },
        {
          question: "Can RoleArc help make my resume sound more professional?",
          answer:
            "Yes. RoleArc's AI rewrite can help polish wording while you keep control of the facts and final content.",
        },
      ]}
    />
  );
}
