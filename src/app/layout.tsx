import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "RoleArc";
const siteUrl = "https://www.rolearc.xyz";
const description =
  "Create job-ready resumes with AI-powered rewriting, strong templates, and polished PDF export.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${appName} | AI Resume Builder`,
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: `${appName} | AI Resume Builder`,
    description,
    url: "/",
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${appName} | AI Resume Builder`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
