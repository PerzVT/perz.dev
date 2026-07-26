"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * Placeholder "login" screen for projects that aren't public yet
 * (status: "coming-soon"). This is a DECORATIVE gate, not real auth: the
 * form authenticates nothing, stores nothing, and sends nothing. It sets
 * a "locked, opening soon" mood and tells the visitor the case study is
 * on the way. Submitting only shows a note. Real content-gating would be
 * a server-side auth setup, not this.
 */
export function ComingSoonGate({ title }: { title: string }) {
  const [notified, setNotified] = useState(false);

  return (
    <div className="mx-auto flex min-h-[62vh] w-full max-w-[420px] flex-col justify-center px-[clamp(20px,4vw,32px)] py-16">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-[7px] self-start text-[12.5px] font-semibold text-pz-muted transition-colors hover:text-pz-ink"
      >
        <span aria-hidden>←</span> Work
      </Link>

      <div className="rounded-2xl border border-pz-border bg-pz-raised p-7">
        <div className="flex items-center gap-2.5 text-pz-accent">
          <Lock className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          <span className="text-[11px] font-bold uppercase tracking-[0.09em]">
            Locked
          </span>
        </div>
        <h1 className="pz-wordmark mt-3 text-[clamp(23px,3.4vw,30px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-pz-ink">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-pz-ink2">
          This case study is coming soon.
        </p>

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setNotified(true);
          }}
        >
          <input
            type="text"
            placeholder="Username"
            autoComplete="off"
            aria-label="Username"
            className="rounded-lg border border-pz-border2 bg-pz-surface px-3.5 py-2.5 text-[14px] text-pz-ink outline-none transition-colors placeholder:text-pz-faint focus:border-pz-accent"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            aria-label="Password"
            className="rounded-lg border border-pz-border2 bg-pz-surface px-3.5 py-2.5 text-[14px] text-pz-ink outline-none transition-colors placeholder:text-pz-faint focus:border-pz-accent"
          />
          <button
            type="submit"
            className="mt-1 rounded-lg bg-pz-accent px-4 py-2.5 text-[13.5px] font-bold text-pz-canvas transition hover:brightness-110"
          >
            Sign in
          </button>
        </form>

        {notified && (
          <p
            className="mt-3.5 text-[12.5px] leading-[1.5] text-pz-faint"
            role="status"
          >
            Access opens at launch. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
