Phase 10 adds automatic profile creation.

Included:
- New Supabase trigger to auto-create a profiles row after signup
- Backfill insert for existing auth users missing a profile
- New users automatically get:
  - plan = free
  - preferred_language = en
  - email copied from auth.users

Why this matters:
- No more manual profile insertion
- No more missing-profile bugs
- Free / Pro logic becomes more stable

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. In Supabase SQL Editor, run:
   supabase/schema_phase10_auto_profiles.sql
6. npm run dev

How to test:
- Create a brand new test account
- Open Supabase Table Editor -> profiles
- Confirm a new row is automatically created
- Confirm the plan defaults to free
- Login to the site and verify Pricing / PDF gate / AI quota work without manual profile creation
