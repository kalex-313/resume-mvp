P0 Pack 1B — Chinese language lock fix

Included:
- src/lib/ai/prompt.ts

This strengthens the AI prompt so:
- Traditional Chinese stays Traditional Chinese
- Simplified Chinese stays Simplified Chinese
- Chinese is not rewritten into Japanese
- rewrite remains conservative and ATS-friendly
