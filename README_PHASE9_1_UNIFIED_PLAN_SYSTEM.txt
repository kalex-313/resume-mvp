Phase 9.1 unifies plan logic.

Included:
- PDF gate now uses profiles.plan from database
- Pricing page now uses profiles.plan from database
- AI quota already uses profiles.plan
- .env.local Pro simulation is no longer used for plan logic

Important:
- Free / Pro is now controlled by profiles.plan only
- To switch a user plan, update the profiles.plan value in Supabase

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. npm run dev
