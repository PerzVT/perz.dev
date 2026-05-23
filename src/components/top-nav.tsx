"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home as HomeIcon, LayoutGrid } from "lucide-react";
import { Sprite } from "@/components/sprite";
import { SfxToggle } from "@/components/sfx-toggle";

/**
 * Top nav bar. Replaces the fixed-left sidebar.
 *
 * Left:   sprite as brand mark (click cycles to next NPC)
 * Right:  4 section links (Home / Projects / Work / Skills) +
 *         mode toggle. Each link has a small lucide icon left of its
 *         label, matching the chip-style nav references the user
 *         provided.
 *
 * Active-section detection uses IntersectionObserver. On /projects
 * routes the Projects link forces active.
 *
 * Hotkeys 1–4 jump between sections.
 */
type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;
const SECTIONS: ReadonlyArray<{
  id: string;
  label: string;
  hotkey: string;
  Icon: IconType;
}> = [
  { id: "home", label: "Home", hotkey: "1", Icon: HomeIcon },
  { id: "projects", label: "Projects", hotkey: "2", Icon: LayoutGrid },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const onProjectRoute = pathname?.startsWith("/projects") ?? false;

  const [active, setActive] = useState<string>(
    onProjectRoute ? "projects" : "home",
  );

  useEffect(() => {
    if (onProjectRoute) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best?.target.id) setActive(best.target.id);
      },
      { threshold: [0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onProjectRoute]);

  const goTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    },
    [router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const match = SECTIONS.find((s) => s.hotkey === e.key);
      if (match) {
        e.preventDefault();
        goTo(match.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        {/* Sprite as brand mark. Click cycles to the next sprite —
            the only Easter-egg interaction in the chrome. 48px after
            the aseprite content-bounds crop fills the canvas with the
            character without crowding the nav links to its right. */}
        <Sprite size={48} />

        <nav className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            const { Icon } = s;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                data-sfx="click"
                className={[
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors sm:px-3",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {s.label}
              </button>
            );
          })}
          <SfxToggle />
        </nav>
      </div>
    </header>
  );
}
