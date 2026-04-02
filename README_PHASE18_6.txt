Phase 18.6 — Reset Password Flow Fix

Included:
- src/app/api/auth/forgot-password/route.ts
- src/app/auth/reset-password/page.tsx
- src/app/auth/reset-password/reset-password-form.tsx

What this fixes:
- Reset email now points to /auth/reset-password
- Clicking the reset email link no longer just lands on the homepage
- Users can enter a new password in a dedicated reset form

Important:
To work correctly, also ensure Supabase Redirect URLs includes:
https://YOUR-DOMAIN/auth/reset-password

How to use:
1. Copy files into your project
2. git add .
3. git commit -m "Phase 18.6 reset password flow fix"
4. git push
