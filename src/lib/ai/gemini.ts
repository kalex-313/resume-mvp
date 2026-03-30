type RewriteMode = "professional" | "concise";

function buildPrompt(input: string, mode: RewriteMode, section: "summary" | "bullet") {
  const styleInstruction =
    mode === "concise"
      ? "Rewrite the text to be concise, clear, and resume-ready."
      : "Rewrite the text to sound professional, polished, and resume-ready.";

  const sectionInstruction =
    section === "summary"
      ? "Return a 2-4 sentence professional resume summary."
      : "Return 1 improved resume bullet point only.";

  return `${styleInstruction}
${sectionInstruction}
Keep the original meaning. Do not invent fake achievements.
Return plain text only.

Input:
${input}`;
}

function localFallback(input: string, mode: RewriteMode, section: "summary" | "bullet") {
  const cleaned = input.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  if (section === "summary") {
    if (mode === "concise") {
      return cleaned.length > 180 ? cleaned.slice(0, 177) + "..." : cleaned;
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  const bullet = cleaned.replace(/^[-•\s]+/, "");
  if (mode === "concise") return bullet;
  return bullet.charAt(0).toUpperCase() + bullet.slice(1);
}

export async function rewriteWithGemini(
  input: string,
  mode: RewriteMode,
  section: "summary" | "bullet"
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      text: localFallback(input, mode, section),
      provider: "local-fallback"
    };
  }

  const prompt = buildPrompt(input, mode, section);
  const models = ["gemini-3-flash-preview", "gemini-2.5-flash-lite"];

  let lastError = "";

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      lastError = await response.text();
      continue;
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("\n")
        .trim() || "";

    return {
      text: text || localFallback(input, mode, section),
      provider: model
    };
  }

  throw new Error(`Gemini request failed: ${lastError}`);
}
