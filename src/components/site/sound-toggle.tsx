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
      className="fixed bottom-[clamp(16px,3vw,26px)] right-[clamp(16px,3vw,26px)] z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-pz-border2 bg-pz-raised shadow-[0_8px_26px_rgba(0,0,0,0.34)] transition-[border-color,transform,color] duration-200 hover:border-pz-muted active:scale-95"
      style={{ color: soundOn ? "var(--pz-accent)" : "var(--pz-ink2)" }}
    >
      {soundOn ? (
        <Volume2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      ) : (
        <VolumeX className="h-[18px] w-[18px]" strokeWidth={2.2} />
      )}
    </button>
  );
}
