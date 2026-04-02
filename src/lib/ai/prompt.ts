export type RewriteSection =
  | "summary"
  | "bullet"
  | "experience"
  | "education"
  | "skills"
  | "resume";

export type RewriteTone = "concise" | "balanced" | "detailed";

function toneInstruction(tone: RewriteTone) {
  if (tone === "concise") {
    return "Make the wording shorter, tighter, and more direct. Remove fluff.";
  }

  if (tone === "detailed") {
    return "Make the wording slightly more descriptive, but still resume-friendly and concise.";
  }

  return "Use a balanced professional resume style.";
}

function sectionInstruction(section: RewriteSection) {
  switch (section) {
    case "summary":
      return "Rewrite this professional summary into 2-4 concise, high-quality resume lines.";
    case "bullet":
      return "Rewrite these resume bullet points with stronger action verbs and clearer business value.";
    case "experience":
      return "Rewrite this work experience entry into clearer, more professional resume language.";
    case "education":
      return "Rewrite this education section for clarity and professional formatting.";
    case "skills":
      return "Rewrite this skills section into cleaner, ATS-friendly wording without inventing new skills.";
    default:
      return "Rewrite this resume content into stronger, professional wording.";
  }
}

export function buildRewritePrompt(
  text: string,
  section: RewriteSection,
  tone: RewriteTone = "balanced"
) {
  return `
You are a professional resume editor.

TASK:
${sectionInstruction(section)}

STRICT RULES:
- Do NOT add any new facts, achievements, or experience
- Do NOT invent numbers, metrics, KPIs, revenue, percentages, or outcomes
- Do NOT guess missing context
- Only improve the wording of what is already written
- Keep everything truthful, realistic, and resume-appropriate
- If the input is weak, improve clarity but do not fabricate stronger claims

STYLE RULES:
- Use clear, professional, ATS-friendly language
- Prefer concise sentence structure
- Use strong action verbs where appropriate
- Remove filler words, repetition, and vague phrasing
- Keep a confident tone without exaggeration
- Avoid buzzwords unless already supported by the input
- Preserve the original meaning

TONE CONTROL:
${toneInstruction(tone)}

OUTPUT RULES:
- Return only the rewritten content
- Do NOT include explanation
- Do NOT include quotation marks
- Do NOT add headings unless the input already contains them
- Do NOT add introductory phrases like "Here is the rewritten version"

INPUT:
${text}
`.trim();
}

export function sanitizeRewriteOutput(value: string) {
  return value
    .replace(/^```[a-zA-Z]*\n?/g, "")
    .replace(/```$/g, "")
    .replace(/^Here is the rewritten version:?/i, "")
    .trim();
}
