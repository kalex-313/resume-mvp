Auth Fix E — Email Confirmation Session Switch

Included:
- src/app/auth/callback/route.ts

Purpose:
- Ensures email confirmation links complete a proper Supabase code exchange
- Prevents the browser from simply falling back to an older logged-in session
- Redirects successful confirmations into /dashboard by default

Important:
1. In Supabase Auth URL settings, make sure your Site URL is your production domain.
2. Add this redirect URL if needed:
   https://YOUR-DOMAIN/auth/callback
3. If your signup code supports emailRedirectTo, point it to:
   https://YOUR-DOMAIN/auth/callback?next=/dashboard

What to test tomorrow:
- Log out first
- Sign up with a fresh email
- Click the confirmation email
- Confirm it lands in the new account session
- Also test in an incognito window
