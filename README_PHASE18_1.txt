Phase 18.1 — Backend Enforcement Pack

Included:
- src/lib/ai/quota.ts
- src/app/api/ai/rewrite/route.ts
- src/app/api/resumes/[id]/route.ts
- src/components/builder/ai-rewrite-controls.tsx

What this does:
1. AI rewrite quota is enforced on the server
2. Free users get blocked after quota runs out
3. Premium template saves are blocked for Free users on the backend
4. Better error message for quota exhaustion

Important note:
This pack does NOT fully hard-lock PDF export if your PDF is still generated only in the browser.
To fully enforce PDF on the backend, the next phase should move PDF export to a server route.

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Phase 18.1 backend enforcement"
4. git push
