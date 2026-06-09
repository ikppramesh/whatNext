import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // Static HTML export — required for GitHub Pages
  basePath: "/whatnext",   // Must match the GitHub repo name (case-insensitive)
  trailingSlash: true,     // /page → /page/index.html (works better on Pages)
  images: {
    unoptimized: true,     // next/image optimizer requires a server; disable for static
  },
};

export default nextConfig;
