/**
 * Root Layout
 * 
 * The top-level layout wrapping every page. Provides:
 * - Global styles and fonts
 * - Meta tags for SEO
 * - Dark theme by default
 */
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Equity Builders — Forensic Property Intelligence Platform",
  description:
    "Transform storm-damaged commercial properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.",
  keywords: [
    "property intelligence",
    "storm damage",
    "insurance claims",
    "equity builders",
    "forensic inspection",
    "commercial property",
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
        {/* Inter font from Google Fonts for clean, professional typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
