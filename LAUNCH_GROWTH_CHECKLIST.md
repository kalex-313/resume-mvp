# RoleArc Launch Growth Checklist

## Launch Readiness

- Production domain opens at `https://www.rolearc.xyz`.
- Signup, login, forgot password, and reset password work.
- Turnstile is enabled on public auth forms.
- Vercel Firewall auth API rate limit is published.
- Supabase 2FA is enabled and recovery codes are stored privately.
- Stripe live checkout, webhook, and billing portal are verified.
- Free user limits and Pro user access are verified.
- AI rewrite works with fallback provider configured.
- PDF export creates a non-empty PDF for Pro users.
- Privacy, Terms, Contact, Pricing, Templates, and SEO pages are reachable.
- Google Analytics, Vercel Analytics, and Google Search Console are active.
- Sitemap is submitted in Search Console.

## First Week Checks

- Check Search Console coverage and indexing status.
- Check Search Console queries with impressions but low click-through rate.
- Check Vercel Analytics for the top landing pages and exits.
- Check signup and upgrade events in analytics.
- Check Vercel Firewall for blocked auth API traffic.
- Check Supabase Auth logs for repeated failures.
- Check Stripe webhook delivery health.

## Conversion Checks

- Homepage hero explains who RoleArc is for within five seconds.
- Primary CTA leads to signup for visitors and dashboard for logged-in users.
- Pricing page explains Free vs Pro without needing support.
- Upgrade CTA is visible before and after the plan cards.
- Payment page avoids test-mode access for public visitors.
- Pro value is framed around unlimited rewrite, premium templates, and PDF export.

## SEO Content Loop

- Pick one Search Console query with impressions and low clicks.
- Improve the matching page title, intro, FAQ, or internal links.
- Add one useful section that answers the query more directly.
- Link from homepage or related SEO pages if the page is important.
- Wait at least one week before judging the result.
