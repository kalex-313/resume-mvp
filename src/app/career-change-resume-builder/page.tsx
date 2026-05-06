import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";

export const metadata: Metadata = {
  title: "Career Change Resume Builder | RoleArc",
  description:
    "Create a career change resume that highlights transferable skills, clearer achievements, and job-ready wording.",
  alternates: {
    canonical: "/career-change-resume-builder",
  },
};

export default function CareerChangeResumeBuilderPage() {
  return (
    <SeoLandingPage
      eyebrow="Career change resume builder"
      title="Reframe your experience for the role you want next"
      description="RoleArc helps career changers explain transferable skills, tighten old-role experience, and build a resume that connects past work to new opportunities."
      primaryCta="Build my career change resume"
      proofPoints={["Transferable skills", "Clearer bullets", "Focused summary"]}
      sections={[
        {
          title: "Connect old experience to new roles",
          body: "Show how your previous work supports the direction you are moving toward.",
          items: ["Transferable skills", "Relevant achievements", "Role-focused summary"],
        },
        {
          title: "Reduce confusing wording",
          body: "Rewrite overly industry-specific notes into clearer language recruiters can scan.",
          items: ["Plain-language bullets", "Better structure", "Consistent tone"],
        },
        {
          title: "Choose a focused layout",
          body: "Use templates that put your strongest relevant information first.",
          items: ["Clean sections", "Skills visibility", "Professional PDF"],
        },
      ]}
      faqs={[
        {
          question: "How do I write a resume for a career change?",
          answer:
            "Start with transferable skills, relevant achievements, and a summary that explains your target direction without hiding your real background.",
        },
        {
          question: "Can AI help with transferable skills?",
          answer:
            "AI rewrite can help clarify wording, but you should choose suggestions that honestly match your experience.",
        },
        {
          question: "Should I use a special template for a career change?",
          answer:
            "A clean template with strong summary and skills sections is often helpful because it guides the reader toward your relevant strengths.",
        },
      ]}
    />
  );
}
