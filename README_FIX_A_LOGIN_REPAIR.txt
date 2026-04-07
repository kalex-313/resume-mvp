Fix A Login Repair

Use this only if your current src/app/auth/login/page.tsx was overwritten by the later broken pack.

Included:
- src/app/auth/login/page.tsx

This restores:
- named imports for SiteHeader / SiteFooter
- the original LoginForm usage
- proper public-page layout wrapper
