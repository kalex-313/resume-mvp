Phase 17.4c — Portal Redirect + Icon-only Favicon Fix

This patch fixes 2 issues:

1. Browser tab icon still showing the wrong logo
- uses favicon.png and apple-touch-icon.png
- both are icon-only, without the CVForge wordmark

2. Manage Subscription opens raw JSON
- replaces the portal route so it redirects straight to Stripe Billing Portal
- no more {"url":"..."} page

Files included:
- public/favicon.png
- public/apple-touch-icon.png
- src/app/layout.tsx
- src/app/api/stripe/portal/route.ts

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Fix portal redirect and icon-only favicon"
4. git push
5. Wait for Vercel redeploy
6. Hard refresh the browser tab (Ctrl+Shift+R)

Note:
Browser favicons can be cached aggressively. If the old icon still appears, try:
- Ctrl+Shift+R
- open in incognito
- close and reopen the tab
