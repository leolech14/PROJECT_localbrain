import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Electron environment
  output: 'export',
  distDir: 'out',

  // Disable image optimization for Electron
  images: {
    unoptimized: true,
  },

  // Performance optimizations
  reactStrictMode: true,
};

export default nextConfig;
