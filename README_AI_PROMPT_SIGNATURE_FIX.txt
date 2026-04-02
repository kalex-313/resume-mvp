AI Prompt Signature Fix

This fixes the current build error:
Expected 1 arguments, but got 3

Why:
Your existing /api/ai/rewrite/route.ts calls:
buildRewritePrompt(text, section, tone)

This version of prompt.ts matches that 3-argument signature.

Replace:
- src/lib/ai/prompt.ts

Then run:
git add .
git commit -m "Fix AI prompt function signature"
git push
