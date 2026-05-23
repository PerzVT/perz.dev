import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Nunito } from "next/font/google";
import { SfxProvider } from "@/components/sfx-provider";
import "./globals.css";

// Font loading is constrained to the weights actually rendered.
// Variable-font axes with the full 100-900 range pull 40-50 KB each;
// pinning to 1-2 weights drops that to ~12 KB per font. Critical-path
// woff2 weight matters because all three preload by default.

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  // Eyebrow caps (400 normal) + the hero role line which uses
  // font-medium (500). No bold mono anywhere.
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Inter — body sans. Used for paragraphs, small text, nav labels.
 * 400 for body, 500 for emphasis (a couple of font-medium classes).
 */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Nunito — display sans for headlines. The .font-display rule in
 * globals.css forces weight 800, so that's the only weight we ship.
 */
const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

// Two descriptions on purpose: the search-engine one is plain and
// indexable; the social-card one (og/twitter) is colloquial and meant to
// catch people in feed. Title is shared since it's the line both
// audiences see.
const SITE_TITLE = "Percy | Making software fun";
const SEARCH_DESC =
  "Game and systems designer. Designer with a product background, now full-time on games.";
const SOCIAL_DESC =
  "Game developer and designer. Currently on Calamity VR at Highstreet. Shipping indie + jam games on the side.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SEARCH_DESC,
  openGraph: {
    title: SITE_TITLE,
    description: SOCIAL_DESC,
    url: "https://perz.dev",
    siteName: "perz.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SOCIAL_DESC,
  },
  metadataBase: new URL("https://perz.dev"),
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Dark class is hardcoded — the site is single-mode now. The
      // class still lives here (rather than on :root in CSS) so any
      // residual `.dark` selectors still resolve, and any third-party
      // chrome that keys off it reads the right palette.
      className={`dark ${jetbrainsMono.variable} ${inter.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Skip-to-content link — first focusable element on every page.
            Visually hidden until focused, then revealed at the top-left
            with a high-contrast pill. WCAG 2.4.1 bypass-blocks. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-3 focus:py-1.5 focus:text-sm focus:text-background focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <SfxProvider />
        {children}
      </body>
    </html>
  );
}
