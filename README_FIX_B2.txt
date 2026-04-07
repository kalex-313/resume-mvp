
Fix B2 — Usage Schema Alignment Pack

Included:
- src/lib/ai/quota.ts
- src/app/api/ai/quota/route.ts
- src/app/api/ai/rewrite/route.ts
- src/components/builder/ai-rewrite-controls.tsx

What this fixes:
1. Aligns AI usage logging with your actual ai_usage_events table:
   - user_id
   - resume_id
   - action_type
   - created_at
2. Makes quota count use action_type = "ai_rewrite"
3. Keeps /upgrade redirect when free quota is exhausted
4. Improves AIRewriteControls vertical alignment in the Experience section
