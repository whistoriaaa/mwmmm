import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ],
    qualities: [65, 75, 80, 85],
  },
  reactCompiler: true,
};

export default nextConfig;
