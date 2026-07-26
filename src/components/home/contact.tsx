import { siteConfig } from "@/lib/config";
import { ContactForm } from "@/components/home/contact-form";

/**
 * Home "Contact" section — a direct email path beside the form. Intro
 * copy is carried verbatim from the comp; the address is the configured
 * one (the comp mocked hello@perz.dev).
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto flex max-w-[1160px] scroll-mt-20 flex-wrap gap-[clamp(32px,6vw,72px)] px-[clamp(20px,4vw,32px)] pb-[clamp(64px,9vh,96px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="min-w-[min(100%,300px)] flex-1 basis-[320px]">
        <h2 className="text-[clamp(26px,3vw,32px)] font-bold tracking-[-0.015em] text-pz-ink">
          Let&apos;s talk.
        </h2>
        <p className="mt-3.5 max-w-[44ch] text-[16px] leading-[1.7] text-pz-ink2">
          Open to game design roles, and always up to talk shop. Say hi.
        </p>
        <a
          href={siteConfig.links.email}
          className="mt-5 inline-block text-[17px] font-semibold text-pz-accent underline-offset-4 transition hover:underline"
        >
          {siteConfig.email}
        </a>
        <div className="mt-1.5 text-[12.5px] text-pz-faint">
          Direct email works too, no form required.
        </div>
      </div>
      <div className="min-w-[min(100%,340px)] flex-1 basis-[400px]">
        <ContactForm />
      </div>
    </section>
  );
}
