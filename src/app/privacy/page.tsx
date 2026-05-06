import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Privacy Policy | RoleArc",
  description: "Learn how RoleArc handles account, resume, AI, subscription, and support information.",
  alternates: {
    canonical: "/privacy",
  },
};

const LEGAL = {
  effectiveDate: "May 5, 2026",
  updatedDate: "May 5, 2026",
  businessName: "RoleArc",
  legalName: "RoleArc",
  location: "British Columbia, Canada",
  privacyEmail: "privacy@rolearc.xyz",
  aiProviders: "Google Gemini",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-3 text-sm text-slate-600">
              Effective date: {LEGAL.effectiveDate}
              <br />
              Last updated: {LEGAL.updatedDate}
            </p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24">
            <p>
              {LEGAL.businessName} ("RoleArc", "we", "us", or "our") provides an
              online resume-building service that helps users create, edit,
              improve, manage, and export resumes. This Privacy Policy explains
              how we collect, use, disclose, and protect personal information
              when you use our website, applications, and related services
              (collectively, the "Services").
            </p>

            <p>
              By using the Services, you agree to the collection, use, and
              disclosure of your information as described in this Privacy Policy.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>A. Account and profile information</h3>
            <p>When you create an account or use the Services, we may collect:</p>
            <ul>
              <li>your name;</li>
              <li>your email address;</li>
              <li>authentication identifiers and account metadata;</li>
              <li>your subscription or billing status; and</li>
              <li>any preferences you choose to provide.</li>
            </ul>

            <h3>B. Resume content and user-generated content</h3>
            <p>We collect the content you submit to RoleArc, including:</p>
            <ul>
              <li>resume summaries, work experience, education, skills, languages, certifications, and contact details;</li>
              <li>edits you make to your resume content;</li>
              <li>template selections and formatting preferences; and</li>
              <li>generated exports or outputs created through the Services.</li>
            </ul>

            <h3>C. Payment and subscription information</h3>
            <p>
              If you purchase a paid subscription, payment information is
              processed by our payment processor. We do not store your full
              payment card number on our servers. We may receive limited billing
              information, such as your plan, billing status, renewal status,
              cancellation status, and limited payment metadata.
            </p>

            <h3>D. Technical and usage information</h3>
            <p>We may automatically collect information such as:</p>
            <ul>
              <li>IP address;</li>
              <li>browser and device information;</li>
              <li>operating system information;</li>
              <li>approximate location derived from technical signals;</li>
              <li>pages viewed and actions taken within the Services;</li>
              <li>error logs, diagnostics, and performance data; and</li>
              <li>timestamps relating to account activity and resume activity.</li>
            </ul>

            <h3>E. Communications</h3>
            <p>
              If you contact us, we may collect your name, email address, the
              contents of your message, and any attachments or information you
              choose to send.
            </p>

            <h2>2. How We Use Information</h2>
            <p>We may use personal information to:</p>
            <ul>
              <li>provide, operate, maintain, and improve the Services;</li>
              <li>create and manage user accounts;</li>
              <li>save, organize, and display resume content;</li>
              <li>provide AI-powered rewrite or improvement features;</li>
              <li>generate PDF exports and related outputs;</li>
              <li>process subscriptions, payments, renewals, and cancellations;</li>
              <li>respond to support requests and user inquiries;</li>
              <li>monitor usage, troubleshoot bugs, and improve reliability and security;</li>
              <li>detect fraud, abuse, or unauthorized access;</li>
              <li>comply with legal obligations; and</li>
              <li>enforce our agreements and protect our rights.</li>
            </ul>

            <h2>3. AI Features</h2>
            <p>
              RoleArc may use third-party AI service providers to process text
              you submit for AI-powered features, such as resume rewrite or
              improvement tools.
            </p>
            <p>When you use AI features:</p>
            <ul>
              <li>the text you choose to submit may be sent to our AI service provider(s) for processing;</li>
              <li>the output is generated automatically and may not always be accurate or appropriate; and</li>
              <li>you remain responsible for reviewing and approving any AI-generated output before using it.</li>
            </ul>
            <p>Current AI provider reference: {LEGAL.aiProviders}.</p>

            <h2>4. How We Share Information</h2>
            <p>We do not sell personal information. We may share information in the following circumstances:</p>

            <h3>A. Service providers</h3>
            <p>
              We may share information with vendors and service providers that
              help us operate the Services, such as providers for hosting,
              infrastructure, authentication, database services, payment
              processing, analytics, logging, and AI processing.
            </p>
            <p>Examples may include providers such as Supabase, Stripe, and applicable AI providers.</p>

            <h3>B. Legal compliance and protection</h3>
            <p>
              We may disclose information if we believe disclosure is reasonably
              necessary to comply with law, legal process, or lawful requests;
              enforce our Terms or other agreements; protect the rights,
              property, or safety of RoleArc, our users, or others; or
              investigate fraud, security issues, or misuse.
            </p>

            <h3>C. Business transfers</h3>
            <p>
              If RoleArc is involved in a merger, acquisition, financing, sale
              of assets, reorganization, or similar transaction, information may
              be transferred as part of that transaction, subject to applicable
              law.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain personal information for as long as reasonably necessary
              to provide the Services, maintain user accounts, support resume
              storage and export functionality, comply with legal or accounting
              obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2>6. Your Choices and Rights</h2>
            <p>Depending on your location and applicable law, you may have rights to:</p>
            <ul>
              <li>access personal information we hold about you;</li>
              <li>request correction of inaccurate personal information;</li>
              <li>request deletion of personal information, subject to legal or operational exceptions;</li>
              <li>withdraw consent where processing is based on consent; and</li>
              <li>contact us with questions or complaints about our privacy practices.</li>
            </ul>
            <p>
              To make a privacy-related request, contact us at{" "}
              <strong>{LEGAL.privacyEmail}</strong>.
            </p>

            <h2>7. Security</h2>
            <p>
              We use reasonable administrative, technical, and organizational
              safeguards designed to protect personal information against
              unauthorized access, loss, misuse, alteration, or disclosure.
              However, no method of transmission over the internet or electronic
              storage is completely secure, and we cannot guarantee absolute
              security.
            </p>

            <h2>8. International Processing</h2>
            <p>
              Your information may be processed and stored in countries outside
              your province, territory, state, or country of residence,
              including where our service providers operate. Those jurisdictions
              may have different data protection laws than your home
              jurisdiction.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              RoleArc is not directed to children under the age of 13, and we
              do not knowingly collect personal information from children under
              13. If you believe a child has provided personal information to
              us, please contact us.
            </p>

            <h2>10. Third-Party Services and Links</h2>
            <p>
              The Services may contain links to third-party websites, services,
              or integrations. We are not responsible for the privacy practices
              of third parties. We encourage you to review their privacy
              policies before providing information to them.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will update the last updated date above. If we make material
              changes, we may provide additional notice where appropriate.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              <strong>{LEGAL.businessName}</strong>
              <br />
              {LEGAL.legalName}
              <br />
              {LEGAL.location}
              <br />
              Email: <strong>{LEGAL.privacyEmail}</strong>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
