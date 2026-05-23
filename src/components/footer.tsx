import { siteConfig } from "@/lib/config";
import {
  GitHubIcon,
  DiscordIcon,
  ItchIcon,
  CurseForgeIcon,
  LinkedInIcon,
} from "@/components/icons";

/**
 * Bottom footer. Centered email + © + small social icon row, in the
 * Jesse Warren pattern.
 */
const SOCIALS = [
  { href: siteConfig.links.github, icon: GitHubIcon, label: "github" },
  { href: siteConfig.links.discord, icon: DiscordIcon, label: "discord" },
  { href: siteConfig.links.linkedin, icon: LinkedInIcon, label: "linkedin" },
  { href: siteConfig.links.itch, icon: ItchIcon, label: "itch" },
  { href: siteConfig.links.curseforge, icon: CurseForgeIcon, label: "cf" },
];

export function Footer() {
  return (
    // bg-background gives the footer its own opaque band so the
    // cutting-mat sage doesn't bleed through behind it in light mode.
    // Matches the DocSection treatment every Zone B section uses.
    <footer className="relative z-10 bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 pb-20 pt-16 text-center sm:px-10">
        <a
          href={siteConfig.links.email}
          className="font-display text-base text-foreground transition-colors hover:text-[var(--hl-accent)] sm:text-lg"
        >
          Mail me
        </a>

        <p className="text-xs text-muted-foreground/70">
          © Kerberus {new Date().getFullYear()}. All rights reserved
          <span className="mx-1.5 text-muted-foreground/50">✦</span>
          made with{" "}
          <span aria-label="love" className="not-italic">
            ❤️
          </span>
        </p>

        {SOCIALS.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                data-sfx="click"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <s.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
