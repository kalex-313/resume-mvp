Phase 18.3 — Duplicate Signup Fix Pack

This pack fixes:
- the same email being able to sign up repeatedly

Included:
- src/app/api/auth/signup/route.ts
- src/app/auth/signup/page.tsx

What it does:
1. Checks whether the email already exists in profiles
2. Blocks duplicate signup with a clear message
3. Uses a server route for signup instead of direct client-only signup

Important:
- This fixes duplicate signup for emails already present in profiles
- A true backend PDF hard lock still needs a separate server-side PDF export flow

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Phase 18.3 duplicate signup fix"
4. git push
