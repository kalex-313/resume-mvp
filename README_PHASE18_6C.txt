Phase 18.6c — Auth Layout Refactor

This pack does 2 things:
1. Applies method A for forgot-password:
   - removes SiteHeader / SiteFooter to avoid server/client build conflict
2. Refactors reset-password to the same clean auth layout style

Included:
- src/app/auth/forgot-password/page.tsx
- src/app/auth/reset-password/page.tsx
- src/app/auth/reset-password/reset-password-form.tsx

Why:
- auth utility pages do not need server header/footer
- avoids importing server-only dependencies into client pages
- keeps auth pages simple and reliable for production

How to use:
1. Replace these files in your project
2. git add .
3. git commit -m "Refactor auth utility pages layout"
4. git push
