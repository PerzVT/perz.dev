import { CopyEmail } from "@/components/portfolio/controls";
import { SocialLinks } from "@/components/site/social-links";

export function SiteFooter() {
  return (
    <footer className="pf-footer">
      <div className="pf-container pf-footer-inner">
        <div className="pf-footer-intro">
          <p>Open to game design roles, and always up to talk shop. Say hi.</p>
          <CopyEmail />
        </div>
        <SocialLinks />
        <div className="pf-legal">
          <p>© Kerberus 2026.</p>
          <p>All rights reserved ✦ made with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
