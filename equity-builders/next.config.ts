import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Equity Builders — Forensic Property Intelligence Platform
   * 
   * Next.js configuration optimized for:
   * - Server-side rendering for SEO and initial load
   * - API routes for backend intelligence layer
   * - Image optimization for property documentation
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
