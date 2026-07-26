import { Banner } from "@/components/site/banner";
import { siteConfig } from "@/lib/config";

/**
 * End-of-page CTA banners, above the contact section. One <Banner> per
 * outbound call to action so they read as a family.
 *
 * PLACEHOLDER ART: the BisectHosting banner uses a solid-colour stand-in
 * (public/placeholder-bisecthosting-banner.png, 2000x500) so the layout
 * is real while the owner makes the artwork. Replace that file in place
 * and nothing else needs to change.
 *
 * PLACEHOLDER LINK: ctaHref points at bisecthosting.com, not the owner's
 * affiliate URL — a working plain link rather than a dead one. Swap it
 * for the affiliate link before this goes to production.
 */
export function EndBanners() {
  return (
    <section className="mx-auto flex max-w-[1160px] flex-col gap-4 px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]">
      <Banner
        image="/placeholder-bisecthosting-banner.png"
        imageAlt=""
        eyebrow="Partner"
        title="Play with friends."
        body="Servers for the games you actually play, from the host I spent two years designing for."
        ctaLabel="Start hosting"
        ctaHref="https://www.bisecthosting.com/"
        accentBg="#e8434f"
      />
      <Banner
        image="/Kerberusgg.png"
        imageAlt=""
        eyebrow="Kerberus"
        title="Come build worlds with us."
        body="Modded servers, packs, and the people who make them. The Discord is where it all happens."
        ctaLabel="Join the Discord"
        ctaHref={siteConfig.links.discord}
        accentBg="#5865f2"
      />
    </section>
  );
}
