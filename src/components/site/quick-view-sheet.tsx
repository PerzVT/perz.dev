"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Carousel } from "@/components/carousel";
import type { WorkCard } from "@/lib/content";

/**
 * Project quick-view — a large bottom sheet with the project's media
 * gallery, summary, contributions, and a link to the full case study.
 * Controlled: the parent passes the active card (or null). Slides up on
 * transform only; scrim, drag-handle, and ✕ all close; Esc closes; focus
 * is trapped while open and restored to the trigger on close. No
 * backdrop-blur. Reduced-motion flattens the slide via the global rule.
 */
export function QuickViewSheet({
  card,
  onClose,
}: {
  card: WorkCard | null;
  onClose: () => void;
}) {
  const open = !!card;
  // Keep the last card mounted through the close transition.
  const [shown, setShown] = useState<WorkCard | null>(card);
  useEffect(() => {
    if (card) setShown(card);
  }, [card]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeRef.current?.focus(), 90);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const f = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const c = shown;

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default transition-opacity duration-300"
        style={{ background: "rgba(6,7,9,.55)", opacity: open ? 1 : 0 }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={c?.title ?? "Project"}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[92vh] w-[min(900px,100%)] flex-col overflow-hidden rounded-t-[18px] border border-b-0 border-pz-border2 bg-pz-raised"
        style={{
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform .38s var(--ease-out)",
          boxShadow: "0 -18px 70px rgba(0,0,0,.45)",
        }}
      >
        {/* Header — drag handle + meta + close */}
        <div className="flex-none border-b border-pz-border">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="flex w-full justify-center pb-1.5 pt-3 transition-opacity hover:opacity-80"
          >
            <span
              aria-hidden
              className="block h-[5px] w-11 rounded-full bg-pz-border2"
            />
          </button>
          <div className="flex items-center gap-3 px-5 pb-3 sm:px-7">
            <span className="truncate text-xs text-pz-faint">{c?.metaLabel}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto flex h-9 w-9 flex-none items-center justify-center rounded-lg text-pz-ink2 transition-colors hover:bg-pz-surface hover:text-pz-ink"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Body — gallery + summary */}
        <div className="flex flex-col gap-4 overflow-y-auto px-5 pb-8 pt-3 sm:px-7">
          {c && c.media.length > 0 && (
            <Carousel key={c.slug} srcs={c.media.join(", ")} />
          )}

          <h3 className="text-[22px] font-bold tracking-[-0.012em] text-pz-ink">
            {c?.title}
          </h3>
          <p className="text-[15px] leading-[1.7] text-pz-ink2">{c?.blurb}</p>

          {c && c.contributions.length > 0 && (
            <div className="border-t border-pz-border pt-4">
              <div className="text-[13px] font-semibold text-pz-ink2">
                Contributions
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                {c.contributions.map((item) => (
                  <span
                    key={item}
                    className="text-[13.5px] leading-[1.55] text-pz-ink2"
                  >
                    <span className="text-pz-faint">–&nbsp;</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {c?.caseHref && (
            <Link
              href={c.caseHref}
              className="text-sm font-semibold text-pz-accent"
            >
              Full case study →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
