import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Equity Builders | Forensic Property Intelligence Platform',
    template: '%s | Equity Builders'
  },
  description: 'Transform commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.',
  keywords: ['property intelligence', 'insurance claims', 'forensic inspection', 'storm damage', 'commercial property', 'equity optimization'],
  authors: [{ name: 'Equity Builders' }],
  creator: 'Equity Builders',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Equity Builders | Forensic Property Intelligence Platform',
    description: 'Transform commercial storm-damaged properties into verified equity gains',
    siteName: 'Equity Builders',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equity Builders',
    description: 'Forensic Property Intelligence Platform',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
