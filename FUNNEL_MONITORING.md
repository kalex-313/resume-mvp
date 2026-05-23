# RoleArc Funnel Monitoring

Last updated: 2026-05-23

Use this checklist to review whether visitors are becoming active RoleArc users. Keep the review simple: look for obvious drop-offs first, then improve one step at a time.

## Core Funnel

| Step | Event | What It Means | Healthy Signal | If It Looks Weak |
| --- | --- | --- | --- | --- |
| 1 | `sign_up_click` | Visitor clicked a signup CTA. | Signup clicks are coming from homepage, pricing, templates, and SEO pages. | Improve CTA wording, mobile header, or first-screen value message. |
| 2 | `signup_page_view` | Visitor reached the signup page. | Most signup clicks lead to this page. | Check navigation, page speed, Turnstile loading, and mobile layout. |
| 3 | `signup_submit` | Visitor tried to create an account. | A meaningful share of signup page visitors submit the form. | Shorten copy, clarify email confirmation, and check form friction. |
| 4 | `signup_success` | Signup request completed. | Most valid submits become success events. | Check Supabase Auth, Turnstile failures, and validation errors. |
| 5 | `dashboard_view` | Signed-in user reached the dashboard. | New users land here after confirming or logging in. | Check auth redirect settings and login flow. |
| 6 | `resume_create_success` | User created a resume. | New users create their first resume quickly. | Make the dashboard first action clearer. |
| 7 | `builder_view` | User opened the builder. | Resume creation sends users into the builder. | Check create-resume API, routing, and builder loading. |
| 8 | `upgrade_click` | User showed purchase intent. | Upgrade clicks happen after users try templates, AI rewrite, or PDF export. | Improve Pro value messaging and locked-feature prompts. |
| 9 | `upgrade_page_view` | User reached the upgrade page. | Most upgrade clicks reach the page. | Check mobile CTA, auth state, and route errors. |
| 10 | `start_checkout` | User clicked payment. | Serious users enter Stripe checkout. | Check price clarity, trust copy, and checkout button state. |

## Source Fields To Watch

Every tracked event should include these helper fields:

- `page_path`: which page the event happened on.
- `referrer_domain`: where the visit came from when available.
- `signup_source`: last signup CTA source in the session.
- `upgrade_source`: last upgrade CTA source in the session.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`: campaign tracking when links include UTM tags.

## Twice-Weekly Review

1. Open Vercel Analytics and Google Analytics.
2. Check the event counts in the core funnel order above.
3. Compare top sources: `producthunt`, `saashub`, `alternativeto`, `google`, and direct traffic.
4. Identify the first step with a clear drop-off.
5. Write one small fix, ship it, and wait a few days before judging.

## Practical Thresholds

- Many `sign_up_click` but few `signup_page_view`: navigation or page load issue.
- Many `signup_page_view` but few `signup_submit`: signup page trust or friction issue.
- Many `signup_success` but few `resume_create_success`: dashboard onboarding issue.
- Many `builder_view` but few `upgrade_click`: Pro value is not obvious enough inside the builder.
- Many `upgrade_page_view` but few `start_checkout`: pricing, trust, or payment anxiety issue.

## Current Priority

Focus on activation before adding more product surface:

1. New user creates first resume.
2. New user sees builder preview.
3. New user understands why Pro exists.
