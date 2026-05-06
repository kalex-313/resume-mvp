import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Terms of Service | RoleArc",
  description: "Read the terms that apply when using RoleArc's resume builder, AI rewrite, PDF export, and subscription features.",
  alternates: {
    canonical: "/terms",
  },
};

const LEGAL = {
  effectiveDate: "May 5, 2026",
  updatedDate: "May 5, 2026",
  businessName: "RoleArc",
  legalName: "RoleArc",
  location: "British Columbia, Canada",
  legalEmail: "legal@rolearc.xyz",
  governingLaw: "British Columbia, Canada",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
            <p className="mt-3 text-sm text-slate-600">
              Effective date: {LEGAL.effectiveDate}
              <br />
              Last updated: {LEGAL.updatedDate}
            </p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24">
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              RoleArc's website, applications, and related services
              (collectively, the "Services"). By accessing or using the
              Services, you agree to be bound by these Terms.
            </p>

            <p>If you do not agree to these Terms, do not use the Services.</p>

            <h2>1. Who We Are</h2>
            <p>
              RoleArc provides online tools to help users create, edit, improve,
              manage, and export resumes and related job application materials.
            </p>

            <h2>2. Eligibility and Accounts</h2>
            <p>
              You must be at least the age of majority in your jurisdiction, or
              otherwise able to form a legally binding agreement, to use the
              Services.
            </p>
            <p>You are responsible for:</p>
            <ul>
              <li>providing accurate account information;</li>
              <li>keeping your login credentials secure;</li>
              <li>all activity that occurs under your account; and</li>
              <li>promptly notifying us if you believe your account has been compromised.</li>
            </ul>

            <h2>3. Your Content</h2>
            <p>
              You retain ownership of the content you submit to the Services,
              including your resume data and related text ("User Content").
            </p>
            <p>
              You grant us a limited, non-exclusive, worldwide license to host,
              store, process, reproduce, and display your User Content only as
              necessary to provide and operate the Services, maintain and
              improve the Services, and comply with law and enforce these Terms.
            </p>
            <p>You represent and warrant that:</p>
            <ul>
              <li>you have the rights necessary to submit your User Content;</li>
              <li>your User Content does not violate applicable law or third-party rights; and</li>
              <li>your User Content does not contain unlawful, abusive, fraudulent, infringing, or harmful material.</li>
            </ul>

            <h2>4. AI Features and Outputs</h2>
            <p>
              RoleArc may offer AI-powered features, including resume rewrite or
              improvement tools.
            </p>
            <p>By using AI features, you understand and agree that:</p>
            <ul>
              <li>AI output is generated automatically and may be inaccurate, incomplete, biased, or unsuitable for your purpose;</li>
              <li>AI output may not reflect legal, hiring, or professional requirements in your jurisdiction or industry;</li>
              <li>you are solely responsible for reviewing, editing, and deciding whether to use any AI-generated output; and</li>
              <li>RoleArc is not responsible for employment, hiring, or career outcomes based on AI-generated output.</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>use the Services for unlawful, fraudulent, deceptive, or harmful purposes;</li>
              <li>interfere with or disrupt the Services or related systems;</li>
              <li>attempt to gain unauthorized access to accounts, systems, or data;</li>
              <li>upload malicious code, bots, spam, or harmful content;</li>
              <li>scrape, copy, reverse engineer, or exploit the Services except as permitted by law;</li>
              <li>use the Services to infringe intellectual property, privacy, or other rights; or</li>
              <li>use the Services in a way that could damage, disable, overburden, or impair the Services.</li>
            </ul>

            <h2>6. Subscriptions, Billing, and Cancellation</h2>
            <p>Some features may require a paid subscription.</p>

            <h3>A. Billing</h3>
            <p>
              If you purchase a paid plan, you authorize our payment processor
              to charge the applicable fees and any applicable taxes to your
              selected payment method on a recurring basis, unless and until you
              cancel.
            </p>

            <h3>B. Renewals</h3>
            <p>
              Paid subscriptions may automatically renew unless canceled before
              the next billing date.
            </p>

            <h3>C. Cancellation</h3>
            <p>
              You may cancel your subscription using the billing tools we make
              available. Unless otherwise stated, cancellation stops future
              renewal charges, and paid access may continue through the end of
              the current billing period.
            </p>

            <h3>D. Fees and refunds</h3>
            <p>
              Except where required by law or expressly stated otherwise, fees
              are non-refundable. You are responsible for reviewing pricing and
              billing terms presented at checkout before purchasing.
            </p>

            <h2>7. Free Plans, Usage Limits, and Feature Gating</h2>
            <p>
              We may offer free plans, trial features, usage limits, quotas, or
              gated features. We may change, suspend, or discontinue these
              offerings at any time, subject to applicable law.
            </p>

            <h2>8. Availability and Changes to the Services</h2>
            <p>
              We may update, modify, suspend, or discontinue any part of the
              Services at any time, with or without notice. We do not guarantee
              that the Services will always be available, uninterrupted,
              error-free, or compatible with every device or browser.
            </p>

            <h2>9. Intellectual Property</h2>
            <p>
              The Services, including our software, branding, site design,
              templates (except your User Content), text, graphics, and related
              materials, are owned by or licensed to RoleArc and are protected
              by intellectual property laws.
            </p>
            <p>
              You may not copy, clone, scrape, reproduce, resell, publish, or
              create a competing service using substantial portions of the
              Services, website design, templates, branding, or content without
              our prior written permission, except where allowed by applicable
              law.
            </p>

            <h2>10. Termination</h2>
            <p>You may stop using the Services at any time.</p>
            <p>
              We may suspend or terminate your access if you violate these
              Terms, if your use poses a legal, security, or operational risk,
              or if we are required to do so by law.
            </p>

            <h2>11. Disclaimers</h2>
            <p>
              THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
              TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
            <p>
              To the maximum extent permitted by law, RoleArc disclaims all
              warranties, express, implied, or statutory, including implied
              warranties of merchantability, fitness for a particular purpose,
              title, and non-infringement.
            </p>
            <p>We do not guarantee that:</p>
            <ul>
              <li>the Services will be uninterrupted, secure, or error-free;</li>
              <li>resume content, templates, exports, or AI outputs will meet your expectations;</li>
              <li>using the Services will result in interviews, job offers, employment, or any particular professional outcome; or</li>
              <li>any AI-generated content will be accurate, lawful, or suitable for your purpose.</li>
            </ul>

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RoleArc AND ITS
              AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AND
              SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY
              LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY,
              ARISING OUT OF OR RELATED TO THE SERVICES OR THESE TERMS.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR
              ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICES OR THESE
              TERMS WILL NOT EXCEED THE GREATER OF:
            </p>
            <ol>
              <li>the amount you paid to RoleArc for the Services in the 12 months before the claim arose; or</li>
              <li>CAD $100.</li>
            </ol>

            <h2>13. Indemnity</h2>
            <p>
              You agree to defend, indemnify, and hold harmless RoleArc and its
              affiliates, officers, directors, employees, contractors, and
              service providers from and against claims, liabilities, damages,
              judgments, losses, costs, and expenses arising out of or related
              to your use of the Services, your User Content, your violation of
              these Terms, or your violation of applicable law or third-party
              rights.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of {LEGAL.governingLaw},
              without regard to conflict of laws rules, unless another governing
              law is required by applicable consumer protection law.
            </p>

            <h2>15. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will
              update the last updated date above. Your continued use of the
              Services after updated Terms become effective means you accept the
              updated Terms.
            </p>

            <h2>16. Contact Us</h2>
            <p>
              <strong>{LEGAL.businessName}</strong>
              <br />
              {LEGAL.legalName}
              <br />
              {LEGAL.location}
              <br />
              Email: <strong>{LEGAL.legalEmail}</strong>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
