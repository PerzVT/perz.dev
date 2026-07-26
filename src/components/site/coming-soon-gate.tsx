"use client";

import { useState } from "react";
import { Button } from "@/components/site/button";

/**
 * Placeholder sign-in screen for projects that aren't public yet
 * (status: "coming-soon"). DECORATIVE, not real auth: the form has no
 * action, authenticates nothing, stores nothing, and sends nothing.
 * Submitting shows a short note. Real gating would be server-side auth.
 */
export function ComingSoonGate() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="mx-auto flex min-h-[68vh] w-full max-w-[380px] flex-col justify-center px-[clamp(20px,4vw,32px)] py-16">
      <form
        className="flex flex-col gap-3"
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
          className="pz-field rounded-lg border border-pz-border2 bg-pz-surface px-3.5 py-3 text-[14px] text-pz-ink outline-none transition-colors placeholder:text-pz-faint focus:border-pz-accent"
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="off"
          aria-label="Password"
          className="pz-field rounded-lg border border-pz-border2 bg-pz-surface px-3.5 py-3 text-[14px] text-pz-ink outline-none transition-colors placeholder:text-pz-faint focus:border-pz-accent"
        />
        <Button type="submit" size="lg" className="mt-1 w-full">
          Sign in
        </Button>
      </form>

      {notified && (
        <p className="mt-4 text-[13.5px] text-pz-ink2" role="status">
          Access opens at launch.
        </p>
      )}
    </div>
  );
}
