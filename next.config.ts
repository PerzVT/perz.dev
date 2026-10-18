import mediaAliases from "./content/portfolio/media-aliases.json";
import type { NextConfig } from "next";

/**
 * Security headers for every route. CSP is strict: no third-party
 * scripts, no embeds. JSON-LD runs inline via
 * <script type="application/ld+json">, which CSP allows by default
 * since it isn't executed as script. Adding Google Analytics, Vercel
 * Insights, or a Calendly embed later means relaxing script-src /
 * frame-src to match.
 *
 * style-src needs 'unsafe-inline' for Tailwind 4's runtime and Next
 * 16's hydration shims; removing it breaks the build. script-src
 * needs 'unsafe-inline' for Next's RSC payload bootstrap, until Next
 * ships a strict CSP recipe.
 */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https:",
  // object-src blocks <object>/<embed>/<applet> (legacy Flash-era
  // injection vectors). frame-src blocks <iframe> embeds. The site
  // uses neither, so closing the door is free.
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  distDir: process.env.PERZ_BUILD_DIR || ".next",
  devIndicators: false,
  agentRules: false,
  // Next 16 restricts images.qualities to [75] by default. The
  // highlight strip needs quality=90 (cover.png originals are 5MB+
  // photos that show artifacts at q=75). Both values stay listed so
  // every other next/image call keeps working at the default.
  images: {
    qualities: [75, 90],
  },
  // The media rename left ~600 old asset URLs outstanding. These are
  // redirects rather than rewrites because Next serializes the rewrite table
  // into _buildManifest.js for client-side route matching, which put 111 KB
  // of dead asset paths in front of every visitor. Redirects stay server-side.
  async redirects() {
    // Projects and sidequests open from the nav menus, so their old index
    // pages land on the home page instead.
    const pages = [
      { source: "/projects", destination: "/#work", permanent: false },
      { source: "/sidequests", destination: "/", permanent: false },
    ];
    return [...pages, ...Object.entries(mediaAliases).map(([source, destination]) => ({
      source: source.replace(/[():*+?{}]/g, "\\$&"),
      destination: encodeURI(destination),
      permanent: true,
    }))];
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
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
