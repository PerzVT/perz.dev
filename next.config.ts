import type { NextConfig } from "next";

/**
 * Security headers applied to every route. CSP is intentionally
 * strict — the site uses no third-party scripts and no embeds at
 * runtime. JSON-LD lives inline in <script type="application/ld+json">
 * which CSP allows by default (it's not executed as script). If we
 * ever add Google Analytics, Vercel Insights, or a Calendly embed,
 * relax script-src / frame-src accordingly.
 *
 * 'unsafe-inline' on style-src is required by Tailwind 4's runtime +
 * Next 16's hydration shims; removing it breaks the build. Inline
 * scripts (`'unsafe-inline'` on script-src) are also required by
 * Next's RSC payload bootstrap until Next ships a strict CSP recipe.
 */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Next 16 default-restricted images.qualities to [75]. The
  // highlight strip uses quality=90 because the cover.png originals
  // are 5MB+ photographic frames that show visible artifacts when
  // downsized at q=75. Listing both values keeps backward compat
  // for every other next/image call that uses the default.
  images: {
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
