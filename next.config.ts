import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a fully static site in /out (used for the shareable preview).
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isExport ? { output: "export" as const } : {}),
  images: {
    unoptimized: isExport,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 78],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2400],
  },
};

export default nextConfig;
