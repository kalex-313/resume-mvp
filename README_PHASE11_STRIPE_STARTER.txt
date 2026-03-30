Phase 11 adds Stripe starter integration.

Included:
- Upgrade to Pro button on Pricing page
- Stripe Checkout session route
- Stripe Billing Portal route
- Stripe webhook route
- Successful checkout updates profiles.plan to 'pro'
- Subscription deletion switches profiles.plan back to 'free'

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. Fill these environment variables:
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   STRIPE_PRICE_ID_PRO_MONTHLY=
   STRIPE_WEBHOOK_SECRET=
6. npm run dev

Stripe setup checklist:
1. Create a Product in Stripe called Pro
2. Create a recurring monthly price
3. Copy the price ID into STRIPE_PRICE_ID_PRO_MONTHLY
4. Create a webhook endpoint to:
   http://localhost:3000/api/stripe/webhook
   (or your tunnel URL if using ngrok / Cloudflare Tunnel)
5. Listen for:
   - checkout.session.completed
   - customer.subscription.deleted
6. Copy webhook signing secret into STRIPE_WEBHOOK_SECRET

Testing notes:
- Without real Stripe keys, the upgrade button will show an error message
- With valid keys and webhook config, successful payment should flip profiles.plan to pro
