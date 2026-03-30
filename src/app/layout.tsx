import type { Metadata } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "ResumeReady";

export const metadata: Metadata = {
  title: `${appName} — Resume Builder`,
  description: "Create resumes with templates, AI rewrite, and export-ready layouts.",
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
