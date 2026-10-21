import { siteConfig } from "@/lib/config";
import { Icon } from "@/components/portfolio/controls";

const SOCIALS = [
  ["GitHub", "github", "imgBrandGithub"],
  ["Discord", "discord", "imgBrandDiscord"],
  ["LinkedIn", "linkedin", "imgBrandLinkedin"],
  ["itch.io", "itch", "imgBrandItch"],
  ["CurseForge", "curseforge", "imgBrandCurseforge"],
] as const;

/** The owner's profiles, as the footer's inline row or the contact page's tiles. */
export function SocialLinks({ variant = "row" }: { variant?: "row" | "tiles" }) {
  return (
    <div className={variant === "tiles" ? "pf-social-tiles" : "pf-socials"}>
      {SOCIALS.map(([label, key, icon]) => (
        <a key={key} href={siteConfig.links[key]} data-brand={key}>
          <Icon name={icon} />
          {label}
        </a>
      ))}
    </div>
  );
}
