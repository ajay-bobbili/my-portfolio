import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fully static site: `next build` writes plain HTML/JS/CSS to ./out (used by GitHub Pages).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
