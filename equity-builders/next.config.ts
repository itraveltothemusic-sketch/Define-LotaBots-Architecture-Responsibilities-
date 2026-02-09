import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server actions for form handling and mutations
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Support large file uploads (inspection photos, documents)
    },
  },
  // Image optimization configuration
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
