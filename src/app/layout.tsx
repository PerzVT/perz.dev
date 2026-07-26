import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { SfxProvider } from "@/components/sfx-provider";
import { ContentGuard } from "@/components/content-guard";
import { SoundToggle } from "@/components/site/sound-toggle";
import { siteConfig } from "@/lib/config";
import "./globals.css";

/**
 * Archivo — the single family for the whole site (Kerberus v2). Loaded
 * as the variable font with both the weight and width (`wdth`) axes, so
 * the wordmark can push to `font-stretch: 122%` while body/headings vary
 * weight. Exposed as `--font-sans`.
 */
const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/** JetBrains Mono — kept for the rare mono label. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_TITLE = siteConfig.metaTitle;

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s · Perz",
  },
  description: siteConfig.positioning,
  openGraph: {
    title: SITE_TITLE,
    description: siteConfig.positioning,
    url: siteConfig.url,
    siteName: `${siteConfig.name}.dev`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: siteConfig.positioning,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
};

// Stamps `data-pz-js` on <html> before paint. The scroll-reveal CSS is
// gated on it, so a no-JS visitor never gets stuck with hidden sections.
// (This also carried the theme resolver until the light theme was
// dropped; the site is single-theme now.)
const JS_FLAG_SCRIPT = `(function(){try{document.documentElement.dataset.pzJs='1';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
        {/* Skip-to-content — first focusable element on every page. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-pz-ink focus:px-3 focus:py-1.5 focus:text-sm focus:text-pz-canvas focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-pz-accent"
        >
          Skip to content
        </a>
        <SfxProvider />
        <ContentGuard />
        {children}
        <SoundToggle />
      </body>
    </html>
  );
}
