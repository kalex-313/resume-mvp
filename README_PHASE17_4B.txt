Phase 17.4b — Upgrade + Favicon Bug Fix

This patch fixes:
1. /upgrade -> Stripe 404
   - adds src/app/api/stripe/create-checkout/route.ts
2. Wrong browser tab icon
   - switches metadata to /favicon.png
   - includes a favicon.png cropped from your real CVForge logo

Files included:
- src/app/api/stripe/create-checkout/route.ts
- src/app/upgrade/page.tsx
- src/app/layout.tsx
- public/favicon.png

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Fix upgrade checkout route and favicon"
4. git push
5. Wait for Vercel redeploy
6. Hard refresh the browser tab
