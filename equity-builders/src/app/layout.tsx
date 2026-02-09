import type { Metadata } from "next";
import "@/styles/globals.css";

/**
 * Root layout for the Equity Builders platform.
 * 
 * This provides the HTML shell and global metadata.
 * Route groups handle the distinction between:
 * - Public/auth pages (no sidebar)
 * - Platform pages (sidebar + topbar)
 */

export const metadata: Metadata = {
  title: "Equity Builders — Forensic Property Intelligence",
  description:
    "Transform storm-damaged commercial properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.",
  keywords: [
    "property intelligence",
    "forensic inspection",
    "insurance claims",
    "storm damage",
    "commercial property",
    "equity building",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
