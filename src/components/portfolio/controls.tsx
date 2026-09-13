"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isSfxMuted, onSfxMuteChange, setSfxMuted } from "@/lib/sfx";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={`pf-icon ${className}`}
      src={`/figma/${name}.svg`}
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
    <button
      className="pf-control pf-audio"
      onClick={() => setSfxMuted(!muted)}
      aria-label={muted ? "Enable all audio" : "Mute all audio"}
      aria-pressed={!muted}
    >
      <Icon name="imgIconSound" />
      {muted && <span className="pf-muted-mark" aria-hidden="true" />}
    </button>
  );
}

const themeSubscribe = (notify: () => void) => {
  window.addEventListener("perz-theme", notify);
  return () => window.removeEventListener("perz-theme", notify);
};
export function ThemeToggle() {
  const light = useSyncExternalStore(
    themeSubscribe,
    () => document.documentElement.dataset.portfolioTheme === "light",
    () => false,
  );
  useEffect(() => {
    try {
      document.documentElement.dataset.portfolioTheme =
        localStorage.getItem("perz:theme") === "light" ? "light" : "dark";
      window.dispatchEvent(new Event("perz-theme"));
    } catch {}
  }, []);
  function toggle() {
    const next = !light;
    document.documentElement.dataset.portfolioTheme = next ? "light" : "dark";
    try {
      localStorage.setItem("perz:theme", next ? "light" : "dark");
    } catch {}
    window.dispatchEvent(new Event("perz-theme"));
  }
  return (
    <button
      className="pf-control"
      onClick={toggle}
      aria-label="Switch color theme"
      aria-pressed={light}
    >
      <Icon name="imgPerzIconSun" />
    </button>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText("hello@perz.dev");
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return (
    <div className="pf-email">
      <a href="mailto:hello@perz.dev">hello@perz.dev</a>
      <button onClick={copy} className="pf-outline">
        <Icon name="imgIconCopy" />
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" role="status">
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
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const muted = useSyncExternalStore(onSfxMuteChange, isSfxMuted, () => true);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let attempted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !attempted && !reduced) {
          attempted = true;
          video.muted = true;
          void video.play().catch(() => {});
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);
  function play() {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      video.pause();
      return;
    }
    if (ended) video.currentTime = 0;
    video.muted = muted;
    void video.play().catch(() => setPlaying(false));
  }
  return (
    <div className={`pf-video ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        muted={muted}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
      />
      <button
        className="pf-button pf-play"
        onClick={play}
        aria-label={`${playing ? "Pause" : ended ? "Replay" : "Play"} ${alt}`}
      >
        <Icon name="imgIconPlay" />
        {playing ? "Pause" : ended ? "Replay" : "Play"}
      </button>
    </div>
  );
}
