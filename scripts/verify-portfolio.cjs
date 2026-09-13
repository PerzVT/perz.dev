const { chromium } = require("playwright-core");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  fs.mkdirSync("shots/portfolio", { recursive: true });
  const results = [];
  for (const width of [1440, 375]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "/",
      "/contact",
      "/resume",
      "/projects",
      "/projects/supercat",
      "/projects/bisecthosting",
      "/projects/highstreet-calamity-vr",
      "/projects/bubble-buddy",
      "/projects/dragoncraft",
      "/projects/mythcraft",
      "/projects/lurk",
      "/projects/poly-punch-vr",
      "/projects/stick-it",
    ]) {
      const response = await page.goto(
        (process.env.BASE_URL || "http://localhost:3100") + route,
        { waitUntil: "networkidle" },
      );
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      results.push({ width, route, status: response.status(), overflow });
      if (["/", "/contact", "/projects/supercat"].includes(route)) {
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 50));
          }
          window.scrollTo(0, 0);
        });
        await page.screenshot({
          path: `shots/portfolio/${width}-${route.replaceAll("/", "_") || "home"}.png`,
          fullPage: true,
        });
      }
      if (route === "/projects/supercat") {
        const carousel = page.locator(".pf-carousel").first();
        const before = await carousel
          .locator(".pf-current img")
          .first()
          .getAttribute("src");
        await carousel.getByRole("button", { name: /Next/ }).click();
        const after = await carousel
          .locator(".pf-current img")
          .first()
          .getAttribute("src");
        results.push({ width, carouselChanges: before !== after });
      }
      if (route === "/contact") {
        await page
          .getByRole("button", { name: "Send message", exact: true })
          .click();
        results.push({
          width,
          formErrors: await page
            .locator("#err-name,#err-email,#err-message")
            .count(),
        });
      }
    }
    results.push({ width, errors });
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(
    "shots/portfolio/results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
  if (
    results.some(
      (r) =>
        (r.status && r.status !== 200) ||
        r.overflow ||
        r.carouselChanges === false ||
        (r.formErrors !== undefined && r.formErrors !== 3) ||
        r.errors?.length,
    )
  )
    process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
