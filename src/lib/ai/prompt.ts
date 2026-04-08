export type RewriteTone = "concise" | "balanced" | "detailed";

export type RewriteSection =
  | "summary"
  | "bullet"
  | "experience"
  | "education"
  | "skills"
  | "resume";

function toneInstruction(tone: RewriteTone) {
  if (tone === "concise") {
    return `
- Reduce unnecessary wording by roughly 20–30% when possible
- Keep the original meaning and confidence level
- Prefer simpler and shorter phrasing
- Do not remove important facts already stated
`;
  }

  if (tone === "detailed") {
    return `
- Add clarity and smoother flow without changing the original meaning
- Keep the same level of confidence as the input
- Make the wording slightly fuller, but still resume-friendly
- Do not add achievements, claims, or stronger implications
`;
  }

  return `
- Keep a balanced professional tone
- Improve clarity and readability without changing meaning
- Avoid exaggeration and unnecessary embellishment
`;
}

function sectionInstruction(section: RewriteSection) {
  switch (section) {
    case "summary":
      return "Rewrite this professional summary into cleaner, more professional resume language.";
    case "bullet":
      return "Rewrite these resume bullet points with clearer action and readability while keeping the original meaning.";
    case "experience":
      return "Rewrite this work experience entry into clearer, more professional language while keeping it truthful.";
    case "education":
      return "Rewrite this education section for clarity and consistency.";
    case "skills":
      return "Rewrite this skills section into clearer, ATS-friendly wording without changing the listed skills.";
    default:
      return "Rewrite this resume content to improve clarity, consistency, and professionalism.";
  }
}

export function buildRewritePrompt(
  text: string,
  section: RewriteSection,
  tone: RewriteTone
) {
  return `
You are a professional resume editor.

TASK:
${sectionInstruction(section)}

LANGUAGE RULES:
- Keep the output in the SAME language as the input
- Do NOT translate unless the input itself is bilingual
- If the input is bilingual, preserve that bilingual style naturally

STRICT RULES:
- Do NOT add new facts
- Do NOT invent achievements, numbers, metrics, or outcomes
- Do NOT make the person sound more senior, more experienced, or more accomplished than the input says
- Keep the same meaning, same level of confidence, and same factual scope as the original text
- Prefer polishing over rewriting from scratch

STYLE RULES:
- Make the text clearer, more natural, and more professional
- Keep it ATS-friendly and easy to scan
- Use simple and direct wording
- Avoid overblown corporate language
- Avoid introducing phrases like "commitment to excellence" unless the input already expresses that idea

TONE:
${toneInstruction(tone)}

OUTPUT RULES:
- Return only the rewritten content
- Do NOT add quotation marks
- Do NOT add headings unless they already exist
- Do NOT add explanations
- Do NOT add introductory phrases like "Here is the rewritten version"

INPUT:
${text}
`.trim();
}

export function sanitizeRewriteOutput(text: string) {
  return text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/i, "")
    .replace(/^Here is the rewritten version:?\s*/i, "")
    .trim();
}
