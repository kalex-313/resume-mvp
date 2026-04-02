Phase 18.5 — Resume Route Alias Fix

This patch adds redirect pages for common old resume URLs and sends them to:

/builder/[id]

Included aliases:
- /resume/[id]
- /resumes/[id]
- /dashboard/resume/[id]
- /dashboard/resumes/[id]

Why:
If your dashboard or create flow still points to an older resume path, users see 404
even though the resume record is created successfully.

How to use:
1. Extract ZIP
2. Copy files into your project
3. git add .
4. git commit -m "Add legacy resume route redirects"
5. git push

If Create New Resume or Edit still goes to 404 after this patch,
the remaining issue is in the exact dashboard link / router.push code,
and I will need that file to patch it directly.
