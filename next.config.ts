import type { NextConfig } from "next";

// When GITHUB_PAGES=true (set only in the GitHub Actions deploy workflow),
// build a fully static export with the correct basePath for Pages.
// Vercel and local dev never set this variable, so they get a normal
// Next.js server build — no basePath, no static export required.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export",       // static HTML/CSS/JS — no Node server needed
    basePath: "/whatNext",  // must match repo name exactly (Linux is case-sensitive)
    trailingSlash: true,    // /page → /page/index.html
    images: { unoptimized: true },
  }),
};

export default nextConfig;
