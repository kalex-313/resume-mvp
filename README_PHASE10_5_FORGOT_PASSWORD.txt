Phase 10.5 adds Forgot Password / Reset Password flow.

Included:
- Forgot password page
- Reset password page
- Login page now shows Forgot password link
- Supabase reset email flow integration

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. npm run dev

Important Supabase step:
- In Supabase Authentication settings, make sure your site URL / redirect URL allows:
  http://localhost:3000/auth/reset-password

How to test:
1. Open /auth/forgot-password
2. Enter your email
3. Click the reset link from email
4. It should open /auth/reset-password
5. Set a new password
6. Login with the new password
