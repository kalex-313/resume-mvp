import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "Student Resume Builder | RoleArc",
  description:
    "Build a student resume with clearer wording, simple templates, and PDF export for internships, part-time jobs, and first roles.",
  alternates: {
    canonical: "/student-resume-builder",
  },
};

export default function StudentResumeBuilderPage() {
  return (
    <SeoLandingPage
      eyebrow="Student resume builder"
      title="Create a stronger student resume even with limited experience"
      description="RoleArc helps students turn coursework, projects, part-time work, volunteering, and school achievements into a clearer resume."
      primaryCta="Build my student resume"
      proofPoints={["Projects", "Part-time work", "Internships"]}
      sections={[
        {
          title: "Use what you already have",
          body: "A student resume can be strong even before you have years of work history.",
          items: ["Class projects", "Volunteer work", "Campus activities"],
        },
        {
          title: "Make experience sound clearer",
          body: "AI rewrite helps turn plain notes into more focused resume bullets.",
          items: ["Action-focused bullets", "Cleaner summaries", "Professional tone"],
        },
        {
          title: "Apply with a clean file",
          body: "Use simple templates and export a polished PDF when you are ready.",
          items: ["ATS-friendly layouts", "Live preview", "PDF export on Pro"],
        },
      ]}
      faqs={[
        {
          question: "What should students put on a resume?",
          answer:
            "Students can include education, projects, part-time work, volunteering, extracurricular activities, skills, and relevant coursework.",
        },
        {
          question: "Can RoleArc help if I have no formal work experience?",
          answer:
            "Yes. RoleArc can help you present projects, school experience, volunteering, and transferable skills more clearly.",
        },
        {
          question: "Is the student resume builder free?",
          answer:
            "You can start on the free plan. Pro unlocks premium templates, unlimited AI rewrite, and professional PDF export.",
        },
      ]}
    />
  );
}
