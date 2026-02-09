/**
 * Root Layout
 * 
 * Global layout wrapper for the entire application.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Equity Builders - Forensic Property Intelligence Platform',
  description: 'Transform commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.',
  keywords: ['property restoration', 'insurance claims', 'forensic inspection', 'commercial property', 'equity'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
