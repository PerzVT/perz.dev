/**
 * Aseprite sprite sheet loader.
 *
 * Expected export settings:
 *   Format: Array
 *   Meta:   Tags + Frame Duration
 *
 * See: https://www.aseprite.org/docs/sprite-sheet/
 */

export interface AsepriteFrame {
  frame: { x: number; y: number; w: number; h: number };
  duration: number; // ms
}

export interface AsepriteTag {
  name: string;
  from: number;
  to: number;
  direction: "forward" | "reverse" | "pingpong";
}

export interface AsepriteJson {
  frames: (AsepriteFrame & { filename?: string })[] | Record<string, AsepriteFrame>;
  meta: {
    image: string;
    size: { w: number; h: number };
    frameTags?: AsepriteTag[];
  };
}

export interface SpriteSheet {
  image: HTMLImageElement;
  frames: AsepriteFrame[];
  tags: Record<string, AsepriteTag>;
  ready: boolean;
  /** Y of the deepest opaque pixel in a frame. Bottom-aligns sheets
   * with different vertical padding. Measured from frame 0. */
  baselineY: number;
  /** Bounding box of opaque pixels in a frame. Lets callers crop the
   * padding so a small sprite still fills the render canvas instead
   * of shrinking inside its own transparent margin. Frame 0 only. */
  contentBounds: { x: number; y: number; w: number; h: number };
}

// Caches each sheet after one load+decode+measure pass. Without it,
// the nav sprite's 5-second auto-rotate would re-fetch and re-measure
// every sheet on every tick, leaking memory and CPU.
const sheetCache = new Map<string, Promise<SpriteSheet>>();

/** Loads a sheet + JSON pair. Fails silently; `ready` stays false so
 *  callers can render a placeholder until assets exist. */
export function loadSheet(basePath: string): Promise<SpriteSheet> {
  const cached = sheetCache.get(basePath);
  if (cached) return cached;
  const promise = loadSheetUncached(basePath);
  sheetCache.set(basePath, promise);
  return promise;
}

async function loadSheetUncached(basePath: string): Promise<SpriteSheet> {
  const sheet: SpriteSheet = {
    image: new Image(),
    frames: [],
    tags: {},
    ready: false,
    baselineY: 0,
    contentBounds: { x: 0, y: 0, w: 0, h: 0 },
  };

  try {
    const res = await fetch(`${basePath}.json`);
    if (!res.ok) return sheet;
    const data: AsepriteJson = await res.json();

    // Normalizes frames: Aseprite can emit array or hash form.
    const frames: AsepriteFrame[] = Array.isArray(data.frames)
      ? data.frames.map((f) => ({ frame: f.frame, duration: f.duration }))
      : Object.values(data.frames).map((f) => ({
          frame: f.frame,
          duration: f.duration,
        }));

    sheet.frames = frames;
    for (const t of data.meta.frameTags ?? []) {
      sheet.tags[t.name] = t;
    }

    // Uses meta.image if it's a bare filename, otherwise <basePath>.png.
    const imgSrc = data.meta.image?.includes("/")
      ? data.meta.image
      : `${basePath}.png`;

    await new Promise<void>((resolve) => {
      sheet.image.onload = () => resolve();
      sheet.image.onerror = () => resolve();
      sheet.image.src = imgSrc;
    });

    sheet.ready = sheet.image.complete && sheet.image.naturalWidth > 0;

    // Measures both baseline (bottom-align in physics-mode draws) and
    // content bounds (tight-fit scaling in static draws, e.g. the nav sprite).
    if (sheet.ready && sheet.frames[0]) {
      const f0 = sheet.frames[0].frame;
      sheet.baselineY = measureBaseline(sheet.image, f0);
      sheet.contentBounds = measureContentBounds(sheet.image, f0);
    }
  } catch {
    // leave ready=false
  }

  return sheet;
}

function measureBaseline(
  img: HTMLImageElement,
  rect: { x: number; y: number; w: number; h: number },
): number {
  try {
    const off = document.createElement("canvas");
    off.width = rect.w;
    off.height = rect.h;
    const ictx = off.getContext("2d");
    if (!ictx) return rect.h;
    ictx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    const data = ictx.getImageData(0, 0, rect.w, rect.h).data;
    // scan bottom-up, return deepest y (exclusive) that contains any opaque px
    for (let y = rect.h - 1; y >= 0; y--) {
      for (let x = 0; x < rect.w; x++) {
        const a = data[(y * rect.w + x) * 4 + 3];
        if (a > 10) return y + 1;
      }
    }
    return rect.h;
  } catch {
    // canvas might be tainted; fall back to frame height
    return rect.h;
  }
}

/**
 * Bounding box of opaque pixels in a frame, in sheet-relative
 * coordinates (already offset by rect.x/y) so callers can pass it
 * straight to drawImage. Falls back to the full frame on
 * tainted-canvas errors.
 */
function measureContentBounds(
  img: HTMLImageElement,
  rect: { x: number; y: number; w: number; h: number },
): { x: number; y: number; w: number; h: number } {
  try {
    const off = document.createElement("canvas");
    off.width = rect.w;
    off.height = rect.h;
    const ictx = off.getContext("2d");
    if (!ictx) return { ...rect };
    ictx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
    const data = ictx.getImageData(0, 0, rect.w, rect.h).data;
    let minX = rect.w;
    let minY = rect.h;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < rect.h; y++) {
      for (let x = 0; x < rect.w; x++) {
        const a = data[(y * rect.w + x) * 4 + 3];
        if (a > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return { ...rect }; // fully transparent, keep full frame
    return {
      x: rect.x + minX,
      y: rect.y + minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1,
    };
  } catch {
    return { ...rect };
  }
}

/** Stateful animator for a single tag on a sheet. */
export class Animator {
  private sheet: SpriteSheet;
  private tag: string;
  private frameIdx = 0;
  private elapsed = 0;
  private direction: 1 | -1 = 1;

  constructor(sheet: SpriteSheet, tag: string) {
    this.sheet = sheet;
    this.tag = tag;
    this.reset();
  }

  setTag(tag: string) {
    if (this.tag === tag) return;
    this.tag = tag;
    this.reset();
  }

  reset() {
    const t = this.sheet.tags[this.tag];
    this.frameIdx = t?.from ?? 0;
    this.elapsed = 0;
    this.direction = t?.direction === "reverse" ? -1 : 1;
  }

  /** Advance by dt (ms). */
  tick(dt: number) {
    if (!this.sheet.ready) return;
    const t = this.sheet.tags[this.tag];
    if (!t) return;
    const frame = this.sheet.frames[this.frameIdx];
    if (!frame) return;

    this.elapsed += dt;
    while (this.elapsed >= frame.duration) {
      this.elapsed -= frame.duration;
      this.advance(t);
    }
  }

  private advance(t: AsepriteTag) {
    if (t.direction === "pingpong") {
      this.frameIdx += this.direction;
      if (this.frameIdx >= t.to) {
        this.frameIdx = t.to;
        this.direction = -1;
      } else if (this.frameIdx <= t.from) {
        this.frameIdx = t.from;
        this.direction = 1;
      }
    } else if (t.direction === "reverse") {
      this.frameIdx--;
      if (this.frameIdx < t.from) this.frameIdx = t.to;
    } else {
      this.frameIdx++;
      if (this.frameIdx > t.to) this.frameIdx = t.from;
    }
  }

  /** Current frame rect on the sheet. */
  currentFrame(): AsepriteFrame | null {
    if (!this.sheet.ready) return null;
    return this.sheet.frames[this.frameIdx] ?? null;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    opts?: { flipX?: boolean; scale?: number },
  ) {
    const f = this.currentFrame();
    if (!f) return false;
    const scale = opts?.scale ?? 1;
    const w = f.frame.w * scale;
    const h = f.frame.h * scale;
    ctx.save();
    if (opts?.flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(x, y);
    }
    ctx.drawImage(
      this.sheet.image,
      f.frame.x,
      f.frame.y,
      f.frame.w,
      f.frame.h,
      0,
      0,
      w,
      h,
    );
    ctx.restore();
    return true;
  }
}
