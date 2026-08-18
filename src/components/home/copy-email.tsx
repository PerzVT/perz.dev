"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * The email address, with a copy button beside it. The address itself
 * stays a mailto link (that's what most people want), and copying is the
 * second path for anyone who'd rather paste it into their own client.
 *
 * The button reports success in place for two seconds rather than firing
 * a toast. Falls back silently if the Clipboard API is unavailable or
 * denied — the mailto link is still there, so nothing is lost.
 */
export function CopyEmail({ email, href }: { email: string; href: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard unavailable or blocked; the mailto link still works.
    }
  };

  return (
    <span className="mt-5 inline-flex items-center gap-2.5">
      <a
        href={href}
        className="text-[17px] font-semibold text-pz-accent underline-offset-4 transition hover:underline"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title={copied ? "Copied" : "Copy"}
        data-sfx="click"
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-pz-muted transition-colors hover:bg-pz-tint-hi hover:text-pz-ink"
      >
        {copied ? (
          <Check
            className="h-[15px] w-[15px] text-pz-accent"
            strokeWidth={2.4}
            aria-hidden
          />
        ) : (
          <Copy className="h-[15px] w-[15px]" strokeWidth={2} aria-hidden />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </span>
  );
}
