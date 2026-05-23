"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Sticky table-of-contents sidebar for project case studies. Reads
 * `[data-case-section]` elements from the page, lists them as small
 * nav buttons in a fixed left rail. Active section bolds + gets a
 * small marker bar; inactive sections are muted.
 *
 * Desktop-only — hidden on mobile. The rail sits fixed-left,
 * vertically centered against the article column.
 *
 * Section discovery uses useSyncExternalStore against a MutationObserver
 * — that satisfies the set-state-in-effect lint and also re-syncs
 * if the article content changes (e.g. fast-refresh during dev).
 */
interface Item {
  id: string;
  label: string;
}

function scanSections(): Item[] {
  if (typeof document === "undefined") return [];
  const nodes = document.querySelectorAll<HTMLElement>("[data-case-section]");
  const list: Item[] = [];
  for (const n of nodes) {
    const id = n.dataset.sectionId;
    const label = n.dataset.sectionLabel;
    if (id && label) list.push({ id, label });
  }
  return list;
}

// Stable empty array for the server snapshot — useSyncExternalStore
// requires getServerSnapshot to be referentially stable across calls
// (returning [] inline creates a new reference each render and breaks).
const SERVER_ITEMS: Item[] = [];

function subscribeSections(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  // The MDX renders synchronously, but Fast Refresh / hot reload can
  // swap section nodes. Watch the article subtree for child mutations.
  const target = document.querySelector("article") ?? document.body;
  const mo = new MutationObserver(cb);
  mo.observe(target, { childList: true, subtree: true });
  return () => mo.disconnect();
}

// Snapshot needs to be referentially stable when nothing changed —
// otherwise useSyncExternalStore loops forever. Memoize against the
// stringified list.
let cachedItems: Item[] = [];
let cachedKey = "";
function getSectionsSnapshot(): Item[] {
  const next = scanSections();
  const key = next.map((i) => `${i.id}|${i.label}`).join(",");
  if (key !== cachedKey) {
    cachedItems = next;
    cachedKey = key;
  }
  return cachedItems;
}

export function CaseToc() {
  const items = useSyncExternalStore(
    subscribeSections,
    getSectionsSnapshot,
    () => SERVER_ITEMS,
  );
  // Active section observed at runtime. Default to null; rendering
  // falls back to the first item when nothing's been observed yet.
  const [observedActive, setObservedActive] = useState<string | null>(null);
  const active = observedActive ?? items[0]?.id ?? null;

  // Track which section is currently in view via IntersectionObserver.
  useEffect(() => {
    if (items.length === 0) return;
    const nodes = items
      .map((i) => document.getElementById(`case-${i.id}`))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best?.target instanceof HTMLElement) {
          const id = best.target.dataset.sectionId;
          if (id) setObservedActive(id);
        }
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    // Sticky inside a flex-row layout — the parent page puts the TOC
    // in a sibling column next to the article. Sticky keeps it pinned
    // to ~30% from the viewport top as the user scrolls. Hidden on
    // narrow screens; kicks in at lg+. Negative top margin offsets
    // pt-12 on the article so the TOC visually lines up with the
    // first case section, not the page title.
    <nav
      aria-label="case study sections"
      className="sticky top-32 hidden h-fit shrink-0 self-start lg:block"
    >
      <ul className="flex flex-col gap-3 border-l border-border pl-4">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id} className="relative">
              {isActive && (
                <span
                  aria-hidden
                  className="absolute -left-[17px] top-1/2 h-4 w-[2px] -translate-y-1/2 bg-foreground"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`case-${it.id}`);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={[
                  "block w-full text-left text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                data-sfx="click"
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
