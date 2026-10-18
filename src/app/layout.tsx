import type { Metadata } from "next";

import { SfxProvider } from "@/components/sfx-provider";
import { ContentGuard } from "@/components/content-guard";

import { IntroLoader } from "@/components/site/intro-loader";
import { PagePolish } from "@/components/site/page-polish";
import { siteConfig } from "@/lib/config";
import { portfolio } from "@/lib/portfolio";
import "./globals.css";
import "./perz-tokens.css";
import "./portfolio.css";
import "./refinements.css";
import "@/components/portfolio/carousel-track.css";

/* No mono font is loaded; numerals hold alignment with `tabular-nums`
   instead. `--font-mono` falls back to a system stack in globals.css if
   code content ever appears. */

const SITE_TITLE = siteConfig.metaTitle;

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s · Perz",
  },
  description: portfolio.home.intro,
  openGraph: {
    title: SITE_TITLE,
    description: portfolio.home.intro,
    url: siteConfig.url,
    siteName: `${siteConfig.name}.dev`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: portfolio.home.intro,
  },
  metadataBase: new URL(siteConfig.url),
};

// Stamps `data-pz-js` on <html> before paint. Scroll-reveal CSS is
// gated on it, so a no-JS visitor never gets stuck with hidden sections.
// The intro is decorative: once per tab session, homepage only, and never blocks
// on network readiness. CSS dismisses it even if hydration fails.
const INTRO_SCRIPT = `(function(){try{if(location.pathname!=='/'||location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var replay=new URLSearchParams(location.search).get('intro')==='1';if(!replay&&sessionStorage.getItem('perz:intro-seen'))return;sessionStorage.setItem('perz:intro-seen','1');document.documentElement.setAttribute('data-intro','');}catch(e){}})();`;

const JS_FLAG_SCRIPT = `(function(){try{var root=document.documentElement;root.dataset.pzJs='1';var theme=localStorage.getItem('perz:theme')==='light'?'light':'dark';root.dataset.portfolioTheme=theme;root.dataset.perzTheme=theme;root.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches?'paused':'running';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
        {/* Skip-to-content: first focusable element on every page. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-pz-ink focus:px-3 focus:py-1.5 focus:text-sm focus:text-pz-canvas focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-pz-accent"
        >
          Skip to content
        </a>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <IntroLoader />
        <SfxProvider />
        <ContentGuard />
        <PagePolish />
        {children}
      </body>
    </html>
  );
}
