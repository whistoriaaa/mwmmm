import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ],
    qualities: [65, 75, 80, 85],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ["image/webp"],
  },
  reactCompiler: true,
};

export default nextConfig;
