/**
 * Screenshot the running dev server with playwright-core driving the
 * system Edge install, so nothing is downloaded.
 *
 * The in-app browser preview does not composite frames on this machine,
 * which makes its screenshot tool time out and its IntersectionObserver
 * callbacks never fire. Real Edge does both, so this is the only way to
 * see scroll reveals, hover states and actual layout.
 *
 *   node scripts/capture.mjs                     # / at all three widths
 *   node scripts/capture.mjs /resume /projects   # named routes
 *   node scripts/capture.mjs / --clip nav        # just the header
 *   node scripts/capture.mjs / --width 1440      # one width
 *
 * Output lands in shots/, which is gitignored.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "shots";

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const clip = flag("clip");
const only = flag("width");
const routes = argv.filter((a) => a.startsWith("/"));
if (routes.length === 0) routes.push("/");

const ALL = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812, mobile: true },
];
const VIEWPORTS = only ? ALL.filter((v) => String(v.width) === only) : ALL;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const written = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  for (const route of routes) {
    const url = BASE + route;
    await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});

    // Sweep the full height so IntersectionObserver reveals fire and
    // lazy media starts loading.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });

    // Then wait for every image to actually decode. Sweeping only
    // starts the fetch; shooting straight after catches half the rail
    // mid-decode and reads as broken cards when nothing is wrong.
    await page
      .waitForFunction(
        () => [...document.querySelectorAll("img")].every((i) => i.complete),
        null,
        { timeout: 15000 },
      )
      .catch(() => {});
    await page.waitForTimeout(600);

    const slug = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    const target = clip ? page.locator(clip).first() : page;
    const file = join(OUT, `${slug}-${vp.name}${clip ? `-${clip}` : ""}.png`);

    await target.screenshot({
      path: file,
      ...(clip ? {} : { fullPage: true }),
    });
    written.push(file);
  }

  await context.close();
}

await browser.close();
console.log(written.join("\n"));
