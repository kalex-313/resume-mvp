import type { Metadata } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeReady";

export const metadata = {
  title: "CVForge — AI Resume Builder",
  description: "Create job-ready resumes with AI-powered rewriting, strong templates, and fast export.",
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
