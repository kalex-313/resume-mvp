Phase 13.3 improves template UX and builder usability.

Included:
- Smart Use Template flow:
  - logged-out users go to signup
  - logged-in users create a new resume from the chosen template and jump straight into builder
- Auto-save in builder
- Saving / Saved state indicator
- Experience and Education section collapse / expand controls
- Sticky preview on large screens

Setup:
1. Extract ZIP
2. Open INNER `resume-mvp` folder
3. npm install
4. Copy your current .env.local into this version
5. npm run dev

Testing:
- While logged in, open /templates and click Use template
- Confirm a new resume is created and builder opens directly
- Edit content and wait a moment
- Confirm auto-save status changes
- Collapse and expand Experience / Education
