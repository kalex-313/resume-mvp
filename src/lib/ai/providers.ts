import { sanitizeRewriteOutput } from "./prompt";

type ProviderResult = {
  text: string;
  provider: "gemini" | "openrouter";
};

type ProviderFailure = {
  provider: "gemini" | "openrouter";
  status?: number;
  message: string;
};

type RewriteProviderResponse = {
  ok: boolean;
  text?: string;
  status?: number;
  retryable: boolean;
  message?: string;
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

function isRetryableStatus(status?: number) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function rewriteWithGeminiProvider(prompt: string): Promise<RewriteProviderResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      retryable: true,
      message: "Missing GEMINI_API_KEY",
    };
  }

  try {
    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json().catch(() => null);
    const rawText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("") || "";
    const text = sanitizeRewriteOutput(rawText);

    if (!response.ok || !text) {
      return {
        ok: false,
        status: response.status,
        retryable: isRetryableStatus(response.status) || !text,
        message: data?.error?.message || "Gemini rewrite failed.",
      };
    }

    return {
      ok: true,
      text,
      retryable: false,
    };
  } catch (error) {
    return {
      ok: false,
      retryable: true,
      message: error instanceof Error ? error.message : "Gemini request failed.",
    };
  }
}

async function rewriteWithOpenRouterProvider(prompt: string): Promise<RewriteProviderResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      retryable: false,
      message: "Missing OPENROUTER_API_KEY",
    };
  }

  try {
    const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://rolearc.xyz",
        "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "RoleArc",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json().catch(() => null);
    const rawText = data?.choices?.[0]?.message?.content || "";
    const text = sanitizeRewriteOutput(rawText);

    if (!response.ok || !text) {
      return {
        ok: false,
        status: response.status,
        retryable: isRetryableStatus(response.status) || !text,
        message: data?.error?.message || "OpenRouter rewrite failed.",
      };
    }

    return {
      ok: true,
      text,
      retryable: false,
    };
  } catch (error) {
    return {
      ok: false,
      retryable: true,
      message: error instanceof Error ? error.message : "OpenRouter request failed.",
    };
  }
}

export async function rewriteWithAIProviders(prompt: string): Promise<ProviderResult> {
  const failures: ProviderFailure[] = [];
  const gemini = await rewriteWithGeminiProvider(prompt);

  if (gemini.ok && gemini.text) {
    return {
      text: gemini.text,
      provider: "gemini",
    };
  }

  failures.push({
    provider: "gemini",
    status: gemini.status,
    message: gemini.message || "Gemini rewrite failed.",
  });

  if (gemini.retryable) {
    const openRouter = await rewriteWithOpenRouterProvider(prompt);

    if (openRouter.ok && openRouter.text) {
      return {
        text: openRouter.text,
        provider: "openrouter",
      };
    }

    failures.push({
      provider: "openrouter",
      status: openRouter.status,
      message: openRouter.message || "OpenRouter rewrite failed.",
    });
  }

  console.error("AI rewrite providers failed:", failures);
  throw new Error("AI rewrite failed.");
}
