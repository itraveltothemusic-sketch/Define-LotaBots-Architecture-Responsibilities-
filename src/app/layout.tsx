/**
 * Root layout for the entire application.
 * 
 * This wraps ALL routes — both public (landing, auth) and 
 * authenticated (platform). Global providers and base styling
 * are established here.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Equity Builders — Forensic Property Intelligence Platform',
  description: 'Transforming commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-slate-900 bg-white">
        {children}
      </body>
    </html>
  );
}
