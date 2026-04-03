Fix B — Enforcement Pack

Included:
- src/lib/ai/quota.ts
- src/app/api/ai/quota/route.ts
- src/app/api/ai/rewrite/route.ts
- src/app/api/resumes/[resumeId]/route.ts
- src/components/builder/resume-editor.tsx

Fixes:
1. Free AI quota now returns the correct shape for the builder UI
2. AI rewrite responses update quota correctly and still redirect to /upgrade when exhausted
3. Free users are blocked from choosing premium templates on the client
4. Free users are blocked from saving premium templates on the backend
