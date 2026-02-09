/**
 * Root Layout
 * 
 * The top-level layout wrapping every page. Provides:
 * - Global styles and fonts (Inter via next/font)
 * - Meta tags for SEO
 * - Dark theme by default
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

/**
 * Inter — Primary typeface for the platform.
 * Clean, professional, and highly readable at all sizes.
 * Used for all UI text, headings, and body copy.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * JetBrains Mono — Monospace typeface for data display.
 * Used for claim numbers, financial figures, and code.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
