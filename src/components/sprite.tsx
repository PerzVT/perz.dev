"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Animator, loadSheet, type SpriteSheet } from "@/lib/aseprite";

/**
 * Sprite — animated aseprite mascot. Lives inline in the top nav as
 * the brand mark. The sprite auto-rotates through the roster on a
 * 5s interval so the nav reads as alive; the surrounding link
 * navigates to the home page on click (the brand mark is the
 * conventional "back to home" affordance).
 *
 * Auto-rotation respects prefers-reduced-motion: under reduced
 * motion the sprite stays on the first roster entry and never
 * cycles.
 *
 * sessionStorage persists the last sprite the rotation surfaced so
 * route changes don't reset the mascot to default.
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

const ROTATION: SpriteKey[] = [
  "slime",
  "luckyslime",
  "bat",
  "ghost",
  "evileye",
  "movingbush",
  "mage-blue",
  "mage-pink",
];

const STORAGE_KEY = "perz:sprite";
const ROTATE_INTERVAL_MS = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeStorage = () => () => {};
const getStoredSprite = (): SpriteKey => {
  if (typeof window === "undefined") return "slime";
  const saved = window.sessionStorage.getItem(STORAGE_KEY);
  if (saved && (ROTATION as readonly string[]).includes(saved)) {
    return saved as SpriteKey;
  }
  return "slime";
};
const getStoredSpriteServer = (): SpriteKey => "slime";

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
  const persisted = useSyncExternalStore(
    subscribeStorage,
    getStoredSprite,
    getStoredSpriteServer,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionClient,
    getReducedMotionServer,
  );
  const [key, setKey] = useState<SpriteKey>(persisted);

  useEffect(() => {
    if (persisted !== key) setKey(persisted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persisted]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<SpriteSheet | null>(null);
  const animatorRef = useRef<Animator | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, key);
  }, [key]);

  // Auto-rotate the sprite roster. Disabled under reduced motion.
  // Also paused when the document is hidden — there's no point
  // cycling the mascot if no one can see it, and the per-key effect
  // below mounts a new RAF loop on every cycle.
  useEffect(() => {
    if (reducedMotion) return;
    let id: number | null = null;
    const start = () => {
      if (id !== null) return;
      id = window.setInterval(() => {
        setKey((prev) => {
          const i = ROTATION.indexOf(prev);
          return ROTATION[(i + 1) % ROTATION.length];
        });
      }, ROTATE_INTERVAL_MS);
    };
    const stop = () => {
      if (id !== null) {
        window.clearInterval(id);
        id = null;
      }
    };
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    // Stop any in-flight RAF immediately so the previous sprite's
    // draw loop can't paint over the new one mid-swap.
    stopLoop();
    // Clear refs eagerly so the (now-stopped) tick can't draw the
    // previous sprite even if a queued frame fires before its
    // cancellation lands.
    animatorRef.current = null;
    sheetRef.current = null;
    // Blank the canvas so the old sprite isn't visible during the
    // microtask gap between key change and the new sheet binding.
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
      // Bind both refs atomically before starting the loop so the
      // tick never reads a mismatched (sheet, animator) pair.
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

  // Pause + resume the RAF on tab visibility. Background tabs already
  // get rAF throttled to ~1 Hz by browsers, but explicitly stopping
  // keeps the draw cycle from running at all and lets the canvas
  // context settle.
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

  // Click navigates to home — the mascot is the conventional "back
  // to start" affordance in the top-nav slot.
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
