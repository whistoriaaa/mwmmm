import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Akar proyek dengan casing drive yang benar (mis. "C:\...").
 * Di Windows, cwd yang diteruskan ke proses kadang berhuruf kecil
 * ("c:\...") sehingga Turbopack gagal mencocokkan path dan menaikkan
 * pencarian modul ke folder induk (C:\Test) — memicu scan folder lain
 * dan akhirnya kehabisan memori. Menetapkan root secara eksplisit
 * mencegah hal itu.
 */
const projectRoot = (() => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd().replace(/^[a-z]:/, (s) => s.toUpperCase());
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // image ramping Docker: server.js mandiri + node_modules yang di-trace
  output: "standalone",
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  // paket native / berat — jangan di-bundle ke server output
  serverExternalPackages: ["sharp", "@libsql/client", "bcryptjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ],
    qualities: [65, 75, 80, 85],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ["image/avif", "image/webp"],
  },
  reactCompiler: true,
};

export default nextConfig;
