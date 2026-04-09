Dashboard full fix pack

Included:
- src/app/dashboard/page.tsx

What this fixes:
- Prevents build failure from new Date(resume.updated_at) when updated_at is undefined
- Keeps dashboard compile-safe with the new optional updated_at typing
- Includes a built-in Create New Resume server action
- Keeps the Edit resume link working

Why this is safer:
- It fixes the current error shown in Vercel
- It avoids depending on a possibly undefined timestamp
- It gives you a complete replacement file instead of a manual patch
