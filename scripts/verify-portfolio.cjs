const { chromium } = require("playwright-core");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  fs.mkdirSync("shots/portfolio", { recursive: true });
  const results = [];
  for (const width of [1440, 375]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "no-preference",
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
      const paused = await page
        .locator("video")
        .evaluateAll((videos) =>
          videos.every((v) => v.paused && v.currentTime === 0),
        );
      results.push({
        width,
        route,
        status: response.status(),
        overflow,
        paused,
      });
      if (route === "/") {
        const rec = page.locator(".pf-recommendations");
        const before = await rec.locator(".pf-quote").first().innerText();
        await rec
          .getByRole("button", {
            name: "Next recommendations item",
            exact: true,
          })
          .click();
        const changed =
          before !== (await rec.locator(".pf-quote").first().innerText());
        const count = await rec.locator(".pf-dots button").count();
        const sliderAbsent =
          (await page.locator("#global-volume").count()) === 0;
        const centered = await page
          .locator(".pf-footer .pf-email")
          .evaluate(
            (el) =>
              Math.abs(
                el.getBoundingClientRect().left +
                  el.getBoundingClientRect().width / 2 -
                  innerWidth / 2,
              ) < 2,
          );
        results.push({
          width,
          recommendations: count,
          recommendationChanges: changed,
          sliderAbsent,
          footerCentered: centered,
        });
      }
      if (route === "/projects/highstreet-calamity-vr") {
        results.push({
          width,
          letterCards: await page.locator(".pf-letter article").count(),
          inventedCta: await page.locator(".pf-project-link").count(),
        });
        await page
          .locator(".pf-letter")
          .screenshot({ path: `shots/portfolio/${width}-letter.png` });
      }
      if (route === "/projects") {
        const button = page.locator(".pf-project-card .pf-button").first();
        await button.hover();
        results.push({
          width,
          buttonStyle: await button.evaluate((el) => ({
            underline: getComputedStyle(el).textDecorationLine,
            transform: getComputedStyle(el).transform,
          })),
        });
      }
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
        r.paused === false ||
        r.recommendationChanges === false ||
        r.footerCentered === false ||
        r.sliderAbsent === false ||
        (r.letterCards !== undefined && r.letterCards !== 1) ||
        r.inventedCta > 0 ||
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
