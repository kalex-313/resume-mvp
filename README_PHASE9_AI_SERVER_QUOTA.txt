Phase 9 adds server-side AI quota.

Included:
- AI usage tracked in database
- Free plan: 10 AI rewrites per month
- Pro plan: unlimited AI rewrites
- Quota checked on the server, not browser time/cookies
- Builder shows current AI usage

Important:
- This protects against local date changes, cookie deletion, timezone changes, and similar client-side tricks.
- Plan is read from the `profiles.plan` column in Supabase.
- If no profile row exists yet, the app safely treats the user as Free.

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. In Supabase SQL Editor, run:
   supabase/schema_phase9_ai_quota.sql
6. npm run dev

How to test:
- Login
- Open a resume
- Use AI Rewrite several times
- Confirm the remaining count goes down
- After 10 Free uses, AI Rewrite should stop and ask for upgrade
- To simulate Pro, update profiles.plan to 'pro' for your user in Supabase
