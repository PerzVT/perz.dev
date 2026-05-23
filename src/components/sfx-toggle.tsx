"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSfxMuted, onSfxMuteChange, setSfxMuted } from "@/lib/sfx";

/**
 * Speaker-icon toggle in the top nav. UI sounds are default-muted on
 * first visit; the user opts in here and the choice persists across
 * sessions via localStorage. The lucide speaker glyphs read as the
 * universal pattern (Volume2 = on, VolumeX = off / muted).
 *
 * Uses useSyncExternalStore against the sfx mute-state listener bus.
 * Server snapshot returns true (muted) so SSR + first client render
 * agree; if the user opted in on a prior session, hydrateSfxFromStorage
 * (called from SfxProvider) flips the in-memory flag and our
 * subscription receives the change.
 */

const subscribeMute = (cb: () => void) => onSfxMuteChange(cb);
const getMutedClient = () => isSfxMuted();
const getMutedServer = () => true;

export function SfxToggle() {
  const muted = useSyncExternalStore(
    subscribeMute,
    getMutedClient,
    getMutedServer,
  );

  const toggle = () => setSfxMuted(!muted);
  const label = muted ? "turn sound on" : "turn sound off";
  const Icon = muted ? VolumeX : Volume2;

  return (
    <button
      type="button"
      onClick={toggle}
      // Opt this button itself out of the click-sound listener — we
      // want the toggle to be silent so toggling-off isn't preceded
      // by a click sound playing one last time.
      data-sfx="off"
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
