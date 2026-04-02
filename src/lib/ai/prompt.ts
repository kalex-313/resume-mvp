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
- Reduce the content length by approximately 30–40%
- Remove redundant phrases and repeated ideas
- Keep only the most impactful and essential information
- Use shorter, direct sentences
- Avoid filler words and unnecessary descriptions
`;
  }

  if (tone === "detailed") {
    return `
- Expand the content slightly with clearer context and flow
- Combine related ideas into smoother, more professional sentences
- Clarify responsibilities and impact WITHOUT adding new facts
- Use slightly longer and more descriptive wording
- Maintain a strong professional resume tone
`;
  }

  return `
- Maintain a balanced professional resume tone
- Keep clarity, readability, and conciseness
- Avoid unnecessary repetition
`;
}

function sectionInstruction(section: RewriteSection) {
  switch (section) {
    case "summary":
      return "Rewrite this professional summary into 2–4 concise, high-quality sentences.";
    case "bullet":
      return "Rewrite these resume bullet points with stronger action verbs and clearer impact. Use strong verbs like Optimized, Improved, Coordinated, Streamlined.";
    case "experience":
      return "Rewrite this work experience entry into clearer, more professional language while keeping factual accuracy.";
    case "education":
      return "Rewrite this education section for clarity and professional formatting.";
    case "skills":
      return "Rewrite this skills section to be concise and well-structured.";
    default:
      return "Rewrite this resume content to improve clarity, impact, and professionalism.";
  }
}

export function buildRewritePrompt(params: {
  text: string;
  section: RewriteSection;
  tone: RewriteTone;
}) {
  return `
You are a professional resume writing assistant.

STRICT RULES:
- Do NOT add new facts
- Do NOT invent numbers, metrics, or achievements
- Only improve wording and clarity
- Keep output clean (no explanations, no extra text)

TASK:
${sectionInstruction(params.section)}

TONE:
${toneInstruction(params.tone)}

CONTENT:
${params.text}

OUTPUT:
Return only the rewritten content.
`;
}

export function sanitizeRewriteOutput(text: string) {
  return text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/```$/, "")
    .trim();
}
