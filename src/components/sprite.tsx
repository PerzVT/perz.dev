"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Animator, loadSheet, type SpriteSheet } from "@/lib/aseprite";

/**
 * Sprite — animated aseprite mascot. Lives inline in the top nav as
 * the brand mark. On each page load the component picks one sprite
 * from the roster at random and draws that for the lifetime of the
 * session. The surrounding link navigates home on click.
 *
 * Random pick happens once in an effect on mount, so the server (and
 * the first client render) always serve the default slime — keeping
 * SSR and hydration in agreement. Once mounted, setKey swaps to a
 * random pick. Under prefers-reduced-motion the default is kept so
 * the canvas is stable from first paint.
 */
type SpriteKey =
  | "slime"
  | "bat"
  | "ghost"
  | "evileye"
  | "luckyslime"
  | "movingbush"
  | "mage-blue"
  | "mage-pink";

const ROSTER: SpriteKey[] = [
  "slime",
  "luckyslime",
  "bat",
  "ghost",
  "evileye",
  "movingbush",
  "mage-blue",
  "mage-pink",
];

const DEFAULT_SPRITE: SpriteKey = "slime";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// useSyncExternalStore plumbing for prefers-reduced-motion.
const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotionClient = () =>
  typeof window !== "undefined" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServer = () => false;

const TAG_PREFERENCE = ["idle", "Idle", "stand", "wait", "walk", "Walk"];

export function Sprite({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
} = {}) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionClient,
    getReducedMotionServer,
  );
  const [key, setKey] = useState<SpriteKey>(DEFAULT_SPRITE);

  // Pick one random sprite on mount. SSR + first client render both
  // show DEFAULT_SPRITE so hydration matches; the effect swaps to a
  // random pick once. Under reduced motion we keep the default so
  // the visual is stable from first paint.
  useEffect(() => {
    if (reducedMotion) return;
    const pick = ROSTER[Math.floor(Math.random() * ROSTER.length)];
    setKey(pick);
  }, [reducedMotion]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<SpriteSheet | null>(null);
  const animatorRef = useRef<Animator | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    stopLoop();
    animatorRef.current = null;
    sheetRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    (async () => {
      const sheet = await loadSheet(`/${key}`);
      if (cancelled) return;
      if (!sheet.ready) return;
      const tag = pickTag(sheet);
      sheetRef.current = sheet;
      animatorRef.current = new Animator(sheet, tag);
      startLoop();
    })();
    return () => {
      cancelled = true;
      stopLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const startLoop = () => {
    stopLoop();
    if (typeof document !== "undefined" && document.hidden) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const anim = animatorRef.current;
      const sheet = sheetRef.current;
      const canvas = canvasRef.current;
      if (anim && sheet && canvas) {
        anim.tick(dt);
        const ctx = canvas.getContext("2d");
        if (ctx) drawFrame(ctx, sheet, anim);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Pause/resume the RAF on tab visibility. Stops the canvas redraw
  // entirely when the tab is hidden — background tabs already get
  // rAF throttled by browsers, but explicit stop is cheaper.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => {
      if (document.hidden) stopLoop();
      else if (sheetRef.current?.ready) startLoop();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buffer = size * 2;
  return (
    <Link
      href="/"
      data-sfx="click"
      aria-label="home"
      className={["inline-flex cursor-pointer", className].join(" ")}
    >
      <canvas
        ref={canvasRef}
        width={buffer}
        height={buffer}
        style={{ width: size, height: size, imageRendering: "pixelated" }}
        aria-hidden
      />
    </Link>
  );
}

function pickTag(sheet: SpriteSheet): string {
  for (const t of TAG_PREFERENCE) {
    if (sheet.tags[t]) return t;
  }
  const first = Object.keys(sheet.tags)[0];
  return first ?? "";
}

/**
 * Draw the animator's current frame using the sheet's measured
 * content bounds — crops the transparent padding around the sprite,
 * then scales the cropped region to fit the canvas.
 */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  sheet: SpriteSheet,
  anim: Animator,
) {
  const f = anim.currentFrame();
  if (!f) return;
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.clearRect(0, 0, cw, ch);
  ctx.imageSmoothingEnabled = false;

  const frame0 = sheet.frames[0]?.frame;
  const bounds = sheet.contentBounds;
  const hasBounds =
    frame0 && bounds.w > 0 && bounds.h > 0 &&
    bounds.w < frame0.w * 0.99;
  const dxInFrame = hasBounds ? bounds.x - frame0.x : 0;
  const dyInFrame = hasBounds ? bounds.y - frame0.y : 0;
  const srcX = f.frame.x + dxInFrame;
  const srcY = f.frame.y + dyInFrame;
  const srcW = hasBounds ? bounds.w : f.frame.w;
  const srcH = hasBounds ? bounds.h : f.frame.h;

  const inset = Math.floor(ch * 0.15);
  const availableH = ch - inset;
  const scale = Math.min(cw / srcW, availableH / srcH);
  const dw = Math.floor(srcW * scale);
  const dh = Math.floor(srcH * scale);
  const dx = Math.floor((cw - dw) / 2);
  const dy = Math.floor((ch - dh) / 2);
  ctx.drawImage(sheet.image, srcX, srcY, srcW, srcH, dx, dy, dw, dh);
}
