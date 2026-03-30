Phase 6 adds a real template system.

Included:
- 3 actual resume templates in preview
- Template selector inside builder
- Saved template choice in database
- PDF export now follows chosen template layout

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. npm run dev

How to test:
- Open any resume
- Change template in builder
- Save draft
- Refresh and confirm template stays selected
- Download PDF and confirm output style matches chosen template
