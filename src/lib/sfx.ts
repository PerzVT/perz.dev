/**
 * Tiny WebAudio synth for UI sounds. No audio files — every sound is
 * generated from oscillators + noise so the bundle stays light and the
 * palette can be tuned by editing numbers.
 *
 * Browsers block AudioContext until a user gesture, so we lazily create
 * it on the first hover/click and gate playback behind that.
 *
 * Default state is MUTED. Visitors opt in via the nav speaker toggle;
 * the choice persists in localStorage. WCAG 1.4.2 doesn't formally
 * apply (sounds are < 3s) but defaulting to silence is the kinder
 * baseline — surprise audio on a portfolio is a hostile choice.
 */

const STORAGE_KEY = "perz:sfx-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

// Default to muted on the server (no localStorage) and as the
// fallback for new visitors. Hydrate from storage on the client via
// the SfxProvider effect that calls hydrateSfxFromStorage().
let muted = true;
const listeners = new Set<(v: boolean) => void>();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (muted) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.08; // global UI volume
    master.connect(ctx.destination);
  }
  // Resume if suspended (Safari)
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSfxMuted(v: boolean) {
  muted = v;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      // Storage may be unavailable (private mode, quota); ignore.
    }
  }
  listeners.forEach((cb) => cb(v));
}

export function isSfxMuted() {
  return muted;
}

/** Read the persisted muted state from storage. Safe to call before
 *  any DOM access — returns the in-memory default on the server. */
export function hydrateSfxFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "0") {
      muted = false;
      listeners.forEach((cb) => cb(false));
    }
  } catch {
    // ignore
  }
}

/** Subscribe to mute-state changes for UI binding. Returns unsubscribe. */
export function onSfxMuteChange(cb: (muted: boolean) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Short blip for hover. High, clean, quick decay. */
export function sfxHover() {
  const c = getCtx();
  if (!c || !master) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.6, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** Clickier "thunk" for button press. Dual-osc body + noise for grit. */
export function sfxClick() {
  const c = getCtx();
  if (!c || !master) return;
  const now = c.currentTime;

  // Body — square dropping pitch feels mechanical
  const osc1 = c.createOscillator();
  const gain1 = c.createGain();
  osc1.type = "square";
  osc1.frequency.setValueAtTime(420, now);
  osc1.frequency.exponentialRampToValueAtTime(140, now + 0.06);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.7, now + 0.003);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc1.connect(gain1).connect(master);
  osc1.start(now);
  osc1.stop(now + 0.1);

  // Tick — short sine spike on top for definition
  const osc2 = c.createOscillator();
  const gain2 = c.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1800, now);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.35, now + 0.002);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  osc2.connect(gain2).connect(master);
  osc2.start(now);
  osc2.stop(now + 0.03);

  // Noise — a touch of grit
  const bufSize = Math.floor(c.sampleRate * 0.03);
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  }
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.12;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1500;
  noise.connect(hp).connect(noiseGain).connect(master);
  noise.start(now);
}

/** Heavier rocker-switch "thock" for the theme toggle. */
export function sfxToggle() {
  const c = getCtx();
  if (!c || !master) return;
  const now = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.8, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.16);

  // Release tick 60ms later — two-stage feel
  const osc2 = c.createOscillator();
  const gain2 = c.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1400, now + 0.06);
  gain2.gain.setValueAtTime(0, now + 0.06);
  gain2.gain.linearRampToValueAtTime(0.25, now + 0.062);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  osc2.connect(gain2).connect(master);
  osc2.start(now + 0.06);
  osc2.stop(now + 0.1);
}
