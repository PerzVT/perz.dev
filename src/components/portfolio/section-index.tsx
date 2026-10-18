"use client";
import { useEffect, useState } from "react";

export type IndexItem = { id: string; title: string };

/** Section links in the left margin, shown once the hero has scrolled away
 *  and marking the section under the reading line. Sections marked
 *  data-full-bleed fill the margin, so the index steps aside over them. */
export function SectionIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = items.map(item => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const hero = document.querySelector(".pf-hero")?.getBoundingClientRect();
      const last = targets[targets.length - 1].getBoundingClientRect();
      const current = [...targets].reverse().find(el => el.getBoundingClientRect().top <= line) ?? targets[0];
      setActive(current.id);
      setVisible((hero ? hero.bottom < window.innerHeight * 0.15 : true) && last.bottom > line && !("fullBleed" in current.dataset));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return <nav className="pf-section-index" aria-label="On this page" data-visible={visible}>
    <p>On this page</p>
    <ol>{items.map(item => <li key={item.id}>
      <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.title}</a>
    </li>)}</ol>
  </nav>;
}
