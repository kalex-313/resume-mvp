# RoleArc Billing Monthly Check

Last run: 2026-05-22

Test account: `testuser009@gmail.com`

## 2026-05-22 Result

| Check | Result | Notes |
| --- | --- | --- |
| Supabase profile state | Pass | Test user is `pro`, `active`, `cancel_at_period_end=false`. |
| Pricing page Pro state | Pass | Playwright confirmed the signed-in user sees `Current plan: Pro`. |
| Billing portal redirect | Pass | Playwright confirmed `Manage Subscription` redirects to `billing.stripe.com`. |
| Production webhook simulated cancellation | Blocked | Local `.env.local` `STRIPE_WEBHOOK_SECRET` does not match Vercel production; production rejected the test event with Stripe signature error. |
| Stripe live readiness from local env | Blocked | Local `.env.local` `STRIPE_SECRET_KEY` is still test mode, so it cannot verify live customers/subscriptions. |

## Current Follow-up

- Sync local billing test environment with the current Vercel production values before running webhook-level tests:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Keep `testuser009@gmail.com` as the billing smoke-test account.
- Re-run:
  - `npm run test:stripe-live-readiness`
  - billing portal smoke test
  - simulated cancellation/restore webhook tests

## Safety Notes

- The successful billing portal smoke test does not create a payment or cancel the subscription.
- The failed simulated webhook tests were rejected by production before mutating subscription state.
- The test user was verified after the failed webhook attempt and remained `pro / active`.
