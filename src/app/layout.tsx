import type { Metadata } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "RoleArc";

export const metadata: Metadata = {
  title: `${appName} | AI Resume Builder`,
  description: "Create job-ready resumes with AI-powered rewriting, strong templates, and polished PDF export.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  openGraph: {
    title: `${appName} | AI Resume Builder`,
    description: "Create job-ready resumes with AI-powered rewriting, strong templates, and polished PDF export.",
    siteName: appName,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
