export type RewriteTone = "concise" | "balanced" | "detailed";

export function toneInstruction(tone: RewriteTone) {
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
