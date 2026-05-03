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
    qualities: [75, 85],
  },
  reactCompiler: true,
};

export default nextConfig;
