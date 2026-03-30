Phase 12.1 strengthens the backend against AI abuse.

Included:
- Per-user AI rate limit:
  - 5 requests per minute
  - 30 requests per day
- IP-hash based request monitoring
- ai_request_logs table for backend safety logging
- Stripe billing portal now prefers stripe_customer_id over email matching
- AI rewrite remains server-side and quota-based

SQL required:
Run this in Supabase SQL Editor:
supabase/schema_phase12_1_anti_abuse.sql

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. Run the SQL file above in Supabase
6. npm run dev

Testing:
- Use AI rewrite several times very quickly
- After enough rapid calls, you should receive a rate limit message
- Wait a minute and retry
- Stripe portal should continue to work using stripe_customer_id
