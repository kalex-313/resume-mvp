Phase 18.7 — AI Upgrade Pack

Included:
- src/lib/ai/prompt.ts
- src/app/api/ai/rewrite/route.ts
- src/components/builder/ai-rewrite-controls.tsx

What this improves:
- section-specific prompts
- tone control (Concise / Balanced / Detailed)
- stricter anti-hallucination rules
- cleaner output sanitization
- small trust note near AI controls

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Upgrade AI prompt system"
4. git push

Test:
- summary rewrite
- experience bullet rewrite
- compare Concise vs Detailed
