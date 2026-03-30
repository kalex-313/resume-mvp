Phase 11.1 fixes Stripe webhook plan updates.

What was fixed:
- Stripe webhook now uses SUPABASE_SERVICE_ROLE_KEY
- Webhook can update profiles.plan even when RLS is enabled
- Webhook now logs upgrade/downgrade errors clearly in the Next.js terminal

New environment variable required:
SUPABASE_SERVICE_ROLE_KEY=

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. Add:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
6. Restart:
   npm run dev

Where to find the service role key:
Supabase -> Project Settings -> API -> service_role

Important:
- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser
- Keep it only in .env.local

Retest flow:
1. Keep Stripe listen terminal running
2. Go to /pricing
3. Click Upgrade to Pro
4. Complete Stripe test payment
5. Refresh the site
6. profiles.plan should become pro
