import { siteConfig } from "@/lib/config";
import { CopyEmail, Icon } from "@/components/portfolio/controls";

export function SiteFooter() {
  const socials = [
    ["GitHub", "github", "imgBrandGithub"],
    ["Discord", "discord", "imgBrandDiscord"],
    ["LinkedIn", "linkedin", "imgBrandLinkedin"],
    ["itch.io", "itch", "imgBrandItch"],
    ["CurseForge", "curseforge", "imgBrandCurseforge"],
  ] as const;
  return (
    <footer className="pf-footer">
      <div className="pf-container pf-footer-inner">
        <div className="pf-footer-intro">
          <p>Open to game design roles, and always up to talk shop. Say hi.</p>
          <CopyEmail />
        </div>
        <div className="pf-socials">
          {socials.map(([label, key, icon]) => (
            <a key={key} href={siteConfig.links[key]} data-brand={key}>
              <Icon name={icon} />
              {label}
            </a>
          ))}
        </div>
        <div className="pf-legal">
          <p>© Kerberus 2026.</p>
          <p>All rights reserved ✦ made with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
