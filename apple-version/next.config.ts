import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // e.g. "/my-portfolio" on GitHub Pages; empty locally

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fully static site: `next build` writes plain HTML/JS/CSS to ./out (used by GitHub Pages).
  output: "export",
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
