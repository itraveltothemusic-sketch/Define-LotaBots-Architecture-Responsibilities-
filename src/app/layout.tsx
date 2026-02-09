import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

/**
 * Root Layout — Equity Builders
 *
 * This is the outermost layout wrapping every page.
 * It provides the HTML shell, metadata, and global providers.
 *
 * Using next/font/google for Inter — optimized font loading
 * with zero layout shift and automatic self-hosting.
 */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
