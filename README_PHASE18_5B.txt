Phase 18.5b — Builder Param Fix

Why the 404 happened:
- Your dashboard and buttons correctly link to /builder/{id}
- Your actual builder route folder is /builder/[resumeId]
- If the page code reads params.id instead of params.resumeId, resume lookup fails and Next.js shows 404

This patch restores the builder page to use:
- params.resumeId
- getResumeById(resumeId, user.id)
- ResumeEditor initialPlan prop

Files included:
- src/app/builder/[resumeId]/page.tsx

How to use:
1. Replace the file in your project
2. git add .
3. git commit -m "Fix builder resumeId param"
4. git push
