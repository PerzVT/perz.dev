import type { Metadata } from "next";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Banners, Hero } from "@/components/portfolio/sections";
import { CopyEmail } from "@/components/portfolio/controls";
import { ContactForm } from "@/components/home/contact-form";
import { SocialLinks } from "@/components/site/social-links";
import { portfolio } from "@/lib/portfolio";
export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  const c = portfolio.contact;
  return (
    <>
      <SiteNav />
      <main className="pf-page pf-contact-page" id="main-content">
        <Hero title="Contact" images={c.hero} description={c.intro} />
        <section className="pf-container pf-section pf-contact-row">
          <div>
            <h2>Say hi</h2>
            <p>{c.invitation}</p>
            <CopyEmail />
            <SocialLinks variant="tiles" />
          </div>
          <div className="pf-contact-form">
            <h2>Send a message</h2>
            <p>Name, email and message are required.</p>
            <ContactForm />
          </div>
        </section>
        <Banners items={c.banners} />
      </main>
      <SiteFooter />
    </>
  );
}
