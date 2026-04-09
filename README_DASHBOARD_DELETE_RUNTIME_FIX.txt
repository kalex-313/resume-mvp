Dashboard delete runtime fix

Included:
- src/app/dashboard/page.tsx
- src/app/dashboard/actions.ts
- src/components/dashboard/delete-resume-button.tsx

What happened:
- The previous version used window.confirm inside a Server Component page.
- That can cause a server-side runtime crash after login.

What this fixes:
- Moves delete confirmation into a Client Component
- Keeps create/delete logic in server actions
- Restores a stable dashboard with header/footer
