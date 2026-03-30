# Phase 15 — Deploy Starter Pack

## 1. Before deploy
Confirm local testing works for:
- signup / login
- forgot password
- resume builder
- AI rewrite
- PDF export
- Stripe checkout
- Stripe cancel / scheduled cancellation

## 2. Push to GitHub
Inside the project folder:

```bash
git init
git add .
git commit -m "Phase 15 deploy starter"
```

Then connect your GitHub repo:

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## 3. Import into Vercel
- Go to Vercel
- Add New Project
- Import your GitHub repo
- Let Vercel detect Next.js automatically

## 4. Add environment variables in Vercel
Copy values from your local `.env.local`.

Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID_PRO_MONTHLY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_COMPANY_NAME
- NEXT_PUBLIC_SUPPORT_EMAIL

## 5. Production URLs
After Vercel gives you your domain, update:
- NEXT_PUBLIC_SITE_URL
- Supabase Site URL
- Supabase redirect URLs
- Stripe webhook endpoint

## 6. Supabase production checklist
In Supabase Authentication settings:
- set Site URL to your production domain
- add redirect URLs for:
  - /auth/reset-password
  - /auth/login
  - /dashboard

## 7. Stripe production checklist
In Stripe:
- create or verify your production product + recurring price
- replace test keys with live keys when ready
- create a live webhook endpoint:
  https://YOUR-DOMAIN/api/stripe/webhook

Recommended Stripe events:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted

## 8. Final production test
After deploy:
- sign up with a fresh account
- login
- create resume from template
- AI rewrite
- PDF export
- upgrade to Pro
- cancel subscription
- verify legal pages and footer links

## 9. Important
- Never commit `.env.local`
- Never expose `SUPABASE_SERVICE_ROLE_KEY`
- Do not switch Stripe to live until test mode is fully stable
