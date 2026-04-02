Forgot Password 60-second Cooldown Fix

Changes:
- cooldown increased from 30s to 60s
- "Too many requests" error auto-clears when cooldown ends
- success message now tells the user to wait 60 seconds

Replace:
- src/app/auth/forgot-password/page.tsx
