PDF Export Fix Pack

Included:
- src/components/builder/pdf-download-button.tsx

What this fixes:
- Creates an off-screen A4 staging area before export
- Forces the exported resume to render at a centered A4 width
- Reduces the common left-shift / large right blank area issue
- Keeps multi-page PDF export working

How to use:
1. Replace your current src/components/builder/pdf-download-button.tsx
2. Deploy
3. Test PDF export again
