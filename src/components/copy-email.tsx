"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";

/**
 * Footer email button. Click copies the address to the clipboard and
 * flips the label to "Copied" for ~1.6s.
 *
 * Replaces the previous `mailto:` anchor. The mailto behavior was a
 * coin flip — users without a configured desktop mail client (which
 * is most browser-only users now) just saw the OS picker for a
 * protocol that resolves to nothing useful. Copy-to-clipboard is the
 * reliable cross-environment fallback: same one click, no app handoff,
 * works on mobile and desktop the same way.
 *
 * If the Clipboard API isn't available (very old Safari, insecure
 * contexts behind file://) we fall back to the legacy
 * `document.execCommand("copy")` path via a hidden textarea, which
 * still works everywhere a browser is going to load this site at all.
 */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending revert on unmount so a fast nav doesn't leak a
  // setState into the void.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = async () => {
    const address = siteConfig.email;
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        ok = true;
      } else {
        // Legacy fallback. Off-screen textarea + execCommand("copy").
        // Browsers without the async Clipboard API (older Safari,
        // insecure contexts) still respect this path.
        const ta = document.createElement("textarea");
        ta.value = address;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch {
      ok = false;
    }
    if (ok) {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-sfx="click"
      aria-label={`Copy email address ${siteConfig.email}`}
      className={`font-display text-base transition-colors sm:text-lg ${
        copied
          ? "text-[var(--hl-accent)]"
          : "text-foreground hover:text-[var(--hl-accent)]"
      }`}
    >
      {/* Single label that swaps text on copy. Earlier version stacked
          two absolute-positioned spans and crossfaded opacity — but the
          "Mail me" span never hid, so during the swap both strings
          rendered on top of each other and the result was a smeared
          glyph collision. One label, one source of truth. */}
      <span aria-live="polite" aria-atomic="true">
        {copied ? "Copied" : "Mail me"}
      </span>
    </button>
  );
}
