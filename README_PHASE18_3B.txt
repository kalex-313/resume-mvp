Phase 18.3b — Signup server/client split fix

Included:
- src/app/auth/signup/page.tsx
- src/app/auth/signup/signup-form.tsx

What this fixes:
- Avoids importing SiteHeader into a client component
- Prevents build errors caused by next/headers usage through server-only imports

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Fix signup page server/client split"
4. git push
