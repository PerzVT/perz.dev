import { siteConfig } from "@/lib/config";
import { FooterSignature } from "@/components/site/footer-signature";

/**
 * Shared footer (Kerberus v2). "Open to game design roles." + the real
 * contact email as a wordmark-scale link, a row of text social links
 * sourced from siteConfig, and the copyright / key-art credit line.
 * NB: the comp shows hello@perz.dev; we wire the configured address.
 */

const SOCIALS = [
  { href: siteConfig.links.github, label: "GitHub" },
  { href: siteConfig.links.discord, label: "Discord" },
  { href: siteConfig.links.linkedin, label: "LinkedIn" },
  { href: siteConfig.links.itch, label: "itch.io" },
  { href: siteConfig.links.curseforge, label: "CurseForge" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-pz-border">
      <FooterSignature />
      <div className="relative z-[1] mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pb-[26px] pt-11">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <div className="text-[15px] font-semibold text-pz-ink">
              Open to work.
            </div>
            <a
              href={siteConfig.links.email}
              className="pz-wordmark mt-2 inline-block text-[22px] text-pz-ink transition-colors hover:text-pz-accent"
            >
              {siteConfig.email}
            </a>
          </div>
          <div className="flex flex-wrap gap-[18px] pt-1.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-sfx="click"
                className="text-[13px] text-pz-ink2 transition-colors hover:text-pz-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-3.5 border-t border-pz-border pt-4 text-xs text-pz-faint">
          <span>© Kerberus {new Date().getFullYear()}.</span>
          <span>
            All rights reserved{" "}
            <span aria-hidden className="mx-0.5 text-pz-accent">
              ✦
            </span>{" "}
            made with <span aria-label="love">❤️</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
