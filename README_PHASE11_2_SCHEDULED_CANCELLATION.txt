Phase 11.2 adds scheduled cancellation handling.

Included:
- customer.subscription.updated now syncs:
  - subscription_status
  - cancel_at_period_end
  - current_period_end
  - stripe_customer_id
- customer.subscription.deleted still downgrades to free
- Pricing page shows:
  - scheduled cancellation date
  - user keeps Pro access until paid period ends
- Builder shows a Pro ending notice

SQL required:
Run this in Supabase SQL Editor:
supabase/schema_phase11_2_subscription_status.sql

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. Run the SQL file above in Supabase
6. npm run dev
