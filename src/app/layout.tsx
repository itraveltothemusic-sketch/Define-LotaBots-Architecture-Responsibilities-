import type { Metadata } from "next";
import "@/styles/globals.css";

/**
 * Root Layout — Equity Builders
 *
 * This is the outermost layout wrapping every page.
 * It provides the HTML shell, metadata, and global providers.
 */
export const metadata: Metadata = {
  title: "Equity Builders — Forensic Property Intelligence",
  description:
    "Transform storm-damaged commercial properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.",
  keywords: [
    "property restoration",
    "storm damage",
    "forensic inspection",
    "insurance claims",
    "equity building",
    "commercial property",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Inter font — clean, professional, high readability */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
