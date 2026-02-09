import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Equity Builders — Forensic Property Intelligence Platform",
  description: "Transform storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.",
  keywords: ["property intelligence", "insurance claims", "storm damage", "forensic inspection", "contractor management"],
  authors: [{ name: "Equity Builders" }],
  openGraph: {
    title: "Equity Builders",
    description: "Forensic Property Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
