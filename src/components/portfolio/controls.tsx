"use client";
import { useMotionPaused } from "@/lib/motion-preference";
import { MediaImage } from "./media-image";
import type { Media } from "@/lib/portfolio";

import { ICON_SRC, type IconName } from "@/lib/icons";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  isSfxMuted,
  onSfxMuteChange,
  setSfxMuted,
  getAudioVolume,
  onAudioVolumeChange,
} from "@/lib/sfx";

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <img
      className={`pf-icon ${className}`}
      src={ICON_SRC[name]}
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
    />
  );
}

export function AudioToggle() {
  const muted = useSyncExternalStore(onSfxMuteChange, isSfxMuted, () => true);
  return (
    <div className="pf-audio-group">
      <button
        className="pf-control pf-audio"
        onClick={() => setSfxMuted(!muted)}
        aria-label={muted ? "Enable all audio" : "Mute all audio"}
        aria-pressed={!muted}
      >
        <Icon name="imgIconSound" />
        {muted && <span className="pf-muted-mark" aria-hidden="true" />}
      </button>
    </div>
  );
}

const themeSubscribe = (notify: () => void) => {
  window.addEventListener("perz-theme", notify);
  return () => window.removeEventListener("perz-theme", notify);
};
// The site styles read data-portfolio-theme; the vendored kit tokens read
// data-perz-theme. Both must change together or the palettes split.
function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.portfolioTheme = theme;
  document.documentElement.dataset.perzTheme = theme;
}

export function ThemeToggle() {
  const light = useSyncExternalStore(
    themeSubscribe,
    () => document.documentElement.dataset.portfolioTheme === "light",
    () => false,
  );
  useEffect(() => {
    try {
      applyTheme(localStorage.getItem("perz:theme") === "light" ? "light" : "dark");
      window.dispatchEvent(new Event("perz-theme"));
    } catch {}
  }, []);
  function toggle() {
    const next = !light;
    applyTheme(next ? "light" : "dark");
    try {
      localStorage.setItem("perz:theme", next ? "light" : "dark");
    } catch {}
    window.dispatchEvent(new Event("perz-theme"));
  }
  return (
    <button
      className="pf-control"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={light}
    >
      {light ? <img className="pf-icon" src="/shared/branding/moon.svg" alt="" aria-hidden="true" width={20} height={20} /> : <Icon name="imgPerzIconSun" />}
    </button>
  );
}

export function PlaybackIcon({ state }: { state: "play" | "pause" | "replay" }) {
  return <svg className="pf-video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {state === "pause" ? <path d="M8 5v14M16 5v14" /> : state === "replay" ? <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></> : <path d="m8 4 12 8-12 8Z" />}
  </svg>;
}
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);
  async function copy() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setCopied(false);
    setFailed(false);
    try {
      await navigator.clipboard.writeText("hello@perz.dev");
      setCopied(true);
      setFailed(false);
      resetTimer.current = setTimeout(() => setCopied(false), 4000);
    } catch {
      setFailed(true);
    }
  }
  return (
    <div className="pf-email">
      <a href="mailto:hello@perz.dev">hello@perz.dev</a>
      <button
        onClick={copy}
        className="pf-outline pf-copy"
        data-copied={copied}
      >
        <span className="pf-copy-feedback" key={copied ? "copied" : "copy"}>
          {copied ? (
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="m4 10 4 4 8-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <Icon name="imgIconCopy" />
          )}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
      <span className={failed ? "pf-copy-status" : "sr-only"} role="status">
        {copied
          ? "Email address copied"
          : failed
            ? "Copy unavailable. Use the email link."
            : ""}
      </span>
    </div>
  );
}

export function AmbientVideo({
  src,
  poster,
  alt,
  className = "",
  fit = "cover",
  posterMedia,
  background,
}: {
  posterMedia?: Media;
  fit?: string;
  background?: string;
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const muted = useSyncExternalStore(onSfxMuteChange, isSfxMuted, () => true);
  const volume = useSyncExternalStore(
    onAudioVolumeChange,
    getAudioVolume,
    () => 0.5,
  );
  useEffect(() => {
    if (ref.current) {
      ref.current.muted = muted;
      ref.current.volume = volume;
    }
  }, [muted, volume]);
  function play() {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      video.pause();
      return;
    }
    if (ended) video.currentTime = 0;
    video.muted = muted;
    setFailed(false);
    void video.play().catch(() => { setPlaying(false); setFailed(true); });
  }
  return (
    <div className={`pf-video ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        style={{
          objectFit: fit === "contain" ? "contain" : "cover",
          background,
        }}
        preload="none"
        playsInline
        muted={muted}
        aria-label={alt}
        onPlay={() => { setPlaying(true); setStarted(true); setEnded(false); }}
        onError={() => setFailed(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
      />
      {posterMedia && !started && <MediaImage className="pf-video-poster" media={posterMedia} alt="" priority />}
      <button
        className="pf-button pf-play"
        onClick={play}
        aria-label={`${playing ? "Pause" : ended ? "Replay" : "Play"} ${alt}`}
      >
        <PlaybackIcon state={playing ? "pause" : ended ? "replay" : "play"} />
        {playing ? "Pause" : ended ? "Replay" : "Play"}
      </button>
      {failed && <p className="pf-video-error" role="status">Video could not play. Try Play again.</p>}
    </div>
  );
}


/** Silent looping section media. Hero playback remains user initiated. */
export function SectionVideo({ src, poster, alt, fit = "contain", background }: {
  src: string; poster?: string; alt: string; fit?: string; background?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useMotionPaused();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    const update = () => {
      video.muted = true;
      if (visible && !document.hidden && !paused) {
        if (!video.getAttribute("src")) video.src = src;
        void video.play().catch(() => {});
      }
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); video.pause(); };
  }, [src, paused]);
  return <div className="pf-video"><video ref={ref} data-section-loop poster={poster}
    muted loop playsInline controls={false} preload="none" aria-label={alt}
    style={{ objectFit: fit === "cover" ? "cover" : "contain", background }} /></div>;
}
