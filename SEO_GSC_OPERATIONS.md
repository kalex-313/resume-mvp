# RoleArc SEO and Search Console Operations

## Weekly Search Console Review

Open Google Search Console and review the last 7 to 28 days:

- Queries with impressions but low clicks.
- Pages with clicks but weak average position.
- Pages with high impressions and low click-through rate.
- Indexing issues for `sitemap.xml`.
- Pages discovered but not indexed.

## Sitemap Submission

Use the canonical `www` property in Google Search Console:

- Preferred property: `https://www.rolearc.xyz/`
- Sitemap URL to submit: `https://www.rolearc.xyz/sitemap.xml`

Do not submit the sitemap under a URL-prefix property for `https://rolearc.xyz/` because the live site redirects that hostname to `https://www.rolearc.xyz/`. If only the non-www property exists, add a new URL-prefix property for `https://www.rolearc.xyz/` or use a Domain property for `rolearc.xyz`.

Live checks that should pass:

- `https://www.rolearc.xyz/sitemap.xml` returns `200 OK`.
- `Content-Type` is `application/xml`.
- `https://www.rolearc.xyz/robots.txt` includes `Sitemap: https://www.rolearc.xyz/sitemap.xml`.
- Sitemap URLs use the same `https://www.rolearc.xyz` canonical host.

If Search Console still shows "Couldn't fetch" immediately after submission, wait 24 hours and inspect `https://www.rolearc.xyz/sitemap.xml` directly. Google often updates this status slowly even when the sitemap is reachable.

## What To Improve First

Prioritize pages that already have impressions:

1. If a query has impressions but low CTR, rewrite the title/meta angle.
2. If a page ranks outside the top 10, add a more specific section or FAQ.
3. If a page is not indexed, inspect URL and request indexing after confirming it returns 200.
4. If a page gets traffic but few signups, improve CTA placement and wording.

## Current Target Pages

- `/ai-resume-builder`
- `/ats-resume-templates`
- `/resume-builder-canada`
- `/student-resume-builder`
- `/career-change-resume-builder`
- `/entry-level-resume-builder`
- `/resume-pdf-export`
- `/templates`
- `/pricing`

## Content Rules

- Be specific about the job-search situation.
- Avoid guaranteed interview or hiring claims.
- Add examples users can recognize quickly.
- Link to related RoleArc pages naturally.
- Keep signup CTA present but not pushy.

## Monthly Content Ideas

- Resume summary examples for students.
- ATS resume formatting checklist.
- Career change resume bullet examples.
- Entry-level resume with no experience guide.
- Canadian resume formatting guide.
- PDF resume export checklist.
