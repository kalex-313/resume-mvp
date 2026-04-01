Phase 17.4 — Upgrade Flow Patch

Included:
- New page:
  src/app/upgrade/page.tsx
- Updated component:
  src/components/pricing/upgrade-buttons.tsx

What changed:
- Pricing page no longer sends users straight to Stripe
- Free users now go to /upgrade first
- /upgrade explains the value of Pro before payment
- Paid users still see Manage Subscription

How to use:
1. Replace these files in your project:
   - src/app/upgrade/page.tsx
   - src/components/pricing/upgrade-buttons.tsx
2. Then run:
   git add .
   git commit -m "Phase 17.4 upgrade flow patch"
   git push
