"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  isSfxMuted,
  onSfxMuteChange,
  setSfxMuted,
  sfxToggle,
} from "@/lib/sfx";

/**
 * Standalone UI-sound toggle, fixed bottom-right. Deliberately not a
 * flyout: the old options FAB hid this behind a hover, which made it
 * hard to reach. One always-visible control, one click. Sound is off by
 * default and the state persists (see lib/sfx).
 */
const subscribeMute = (cb: () => void) => onSfxMuteChange(cb);

export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMute, isSfxMuted, () => true);
  const soundOn = !muted;

  const toggle = () => {
    const next = !soundOn;
    setSfxMuted(!next);
    // Confirm chirp only when switching on (audio is unmuted by now).
    if (next) sfxToggle();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn UI sound off" : "Turn UI sound on"}
      title={soundOn ? "Sound on" : "Sound off"}
      data-sfx="off"
      // Light disc on a near-black canvas. A dark circle on dark reads as
      // a smudge; this is the one piece of always-on chrome, so it has to
      // be findable without hunting for it.
      className="fixed bottom-[clamp(16px,3vw,26px)] right-[clamp(16px,3vw,26px)] z-[90] flex h-12 w-12 items-center justify-center rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-[transform,background-color,color] duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: soundOn ? "var(--pz-accent)" : "var(--pz-ink)",
        color: "var(--pz-canvas)",
      }}
    >
      {soundOn ? (
        <Volume2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      ) : (
        <VolumeX className="h-[18px] w-[18px]" strokeWidth={2.2} />
      )}
    </button>
  );
}
