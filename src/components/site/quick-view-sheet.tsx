"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/blur";
import type { WorkCard } from "@/lib/content";

/**
 * Vaul-style bottom sheet quick-view, shared by the home "Selected work"
 * and the "My work" grid. Controlled: the parent passes the active card
 * (or null). Slides up on transform only; scrim + drag-handle + ✕ all
 * close; Esc closes; focus is trapped inside while open and restored to
 * the trigger on close. No backdrop-blur. Reduced-motion flattens the
 * slide via the global rule.
 */
export function QuickViewSheet({
  card,
  onClose,
}: {
  card: WorkCard | null;
  onClose: () => void;
}) {
  const open = !!card;
  // Keep the last card mounted through the close transition so content
  // doesn't blank out mid-slide.
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
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
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
      {/* Scrim */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default transition-opacity duration-300"
        style={{ background: "rgba(6,7,9,.5)", opacity: open ? 1 : 0 }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={c?.title ?? "Project"}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[min(86vh,860px)] w-[min(680px,100%)] flex-col overflow-hidden rounded-t-[18px] border border-b-0 border-pz-border2 bg-pz-raised"
        style={{
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform .38s var(--ease-out)",
          boxShadow: "0 -18px 70px rgba(0,0,0,.45)",
        }}
      >
        {/* Drag handle (also closes) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="flex w-full flex-none justify-center pb-2 pt-3 transition-opacity hover:opacity-80"
        >
          <span
            aria-hidden
            className="block h-[5px] w-11 rounded-full bg-pz-border2"
          />
        </button>

        <div className="flex flex-col gap-3.5 overflow-y-auto px-6 pb-[30px] pt-0.5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-pz-faint">{c?.metaLabel}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg border border-pz-border2 text-sm leading-none text-pz-ink2 transition-colors hover:text-pz-ink"
            >
              ✕
            </button>
          </div>

          <div className="relative aspect-[16/10] flex-none overflow-hidden rounded-[10px] border border-pz-border bg-pz-surface">
            {c?.image && (
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(min-width: 680px) 680px, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
                style={{ objectPosition: c.cardFocus ?? "center" }}
              />
            )}
          </div>

          <h3 className="text-[21px] font-bold tracking-[-0.012em] text-pz-ink">
            {c?.title}
          </h3>
          <p className="text-sm leading-[1.7] text-pz-ink2">{c?.blurb}</p>

          <div className="border-t border-pz-border pt-3.5">
            <div className="text-[13px] font-semibold text-pz-ink2">
              Contributions
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {c?.contributions.map((item) => (
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
