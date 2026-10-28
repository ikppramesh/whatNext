import type { NextConfig } from "next";

// When GITHUB_PAGES=true (set only in the GitHub Actions deploy workflow),
// build a fully static export with the correct basePath for Pages.
// Vercel and local dev never set this variable, so they get a normal
// Next.js server build — no basePath, no static export required.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isDev = process.env.NODE_ENV !== "production";

// Next.js emits inline bootstrap scripts and styles, so 'unsafe-inline' is
// required for both. 'unsafe-eval' is only needed by the dev server.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.github.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isGitHubPages
    ? {
        output: "export",       // static HTML/CSS/JS — no Node server needed
        basePath: "/whatNext",  // must match repo name exactly (Linux is case-sensitive)
        trailingSlash: true,    // /page → /page/index.html
        images: { unoptimized: true },
      }
    : {
        // headers() is unsupported with static export, so only set it for server builds.
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
