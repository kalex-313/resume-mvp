Phase 4 adds free-tier AI rewrite.

How it works:
- If GEMINI_API_KEY is filled, AI Rewrite uses Gemini 2.0 Flash
- If GEMINI_API_KEY is empty, it uses a safe local fallback so the buttons still work for testing

Where to test:
- Login
- Open any resume in Builder
- Use AI Rewrite / Make Concise on Summary or Experience
