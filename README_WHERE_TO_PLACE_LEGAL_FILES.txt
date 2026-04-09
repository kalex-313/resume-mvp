Where to place the previous Markdown files:
- They are draft source files only.
- Do NOT put those three .md files directly into src/app unless you already use markdown page rendering.
- The practical place for them is a project folder like:
  /legal-drafts/
or
  /docs/legal/
  so you can edit and keep them as references.

For your live site, the files that actually matter are:
- src/app/privacy/page.tsx
- src/app/terms/page.tsx

This pack gives you those two ready-to-use page files.

Before public launch, replace these placeholders:
- [Month DD, YYYY]
- [privacy@yourdomain.com]
- [legal@yourdomain.com]
- [Legal business name, if different]
- [Business city / province / country]
- [Name of AI provider(s)]
