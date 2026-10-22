# Password recovery release checks

Problem: submitting a new password without a recovery session produces `Auth session missing!`. The reset form previously submitted immediately, without checking for a valid session. PKCE links also require the verifier from the browser where recovery was requested; Gmail opening Safari can lose that verifier.

Changes:

- Wait for SDK initialization and validate the current user before enabling password entry or submission.
- Support legacy recovery fragments and recovery token hashes; reject invalid/expired links with a fresh-link action.
- New PKCE email requests return through the auth callback; legacy direct reset links remain supported.
- Add `/auth/recovery` for recovery-only token-hash verification with cookies, a clean redirect, no caching and no referrer.
- Restrict the auth callback return destination to the same origin.

## Required rollout order

1. Obtain the current production source. This checkout is GitHub main at `4589406` (May 29), older than production changes recorded in Linear. Port only these changes onto the current source; do not replace the complete production app with this old checkout.
2. Deploy and verify `/auth/recovery` and the reset form.
3. In the existing Supabase project, set the **Reset password** email body to `supabase/templates/recovery.html`. Preserve other templates, SMTP settings and Auth security controls. Ensure Site URL is the canonical production origin (`https://www.rolearc.xyz`). This template change is necessary for cross-browser recovery without the original PKCE verifier. Keep this endpoint available while issued emails remain valid.
4. Ensure the redirect allow list includes `https://www.rolearc.xyz/auth/callback` (or an existing applicable wildcard), before enabling the changed forgot-password redirect. Do not remove existing reset URL entries while old links remain in use.
5. Request a fresh recovery email using a designated test account. Test same-browser and Gmail-to-Safari flows. The user enters and submits the new password; do not ask for it in chat. Verify login afterward. Never mark this real delivery/credential test passed based on mocks.

## Automated checks

`npx playwright test tests/e2e/password-recovery.spec.ts --project=chromium`

For browser tests, run the app with the following synthetic configuration only:

```
NEXT_PUBLIC_SUPABASE_URL=https://recovery-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=synthetic-test-key
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3010
```

Then run `E2E_BASE_URL=http://127.0.0.1:3010 npx playwright test tests/e2e/password-recovery-ui.spec.ts`. The UI suite intercepts Auth requests and only submits a synthetic password to mocks. It skips non-local targets; do not configure it against a real database.
