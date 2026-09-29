import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://www.artic.edu/**", route => route.fulfill({ status: 200, contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg"/>' }));
  await page.addInitScript(() => {
    window.samples = [];
    for (const name of ["navigation-start", "navigation-swap", "navigation-complete", "navigation-abort", "fragment-reveal"]) {
      document.addEventListener(`nativefragments:${name}`, e => window.samples.push({ name, time: performance.now(), url: e.detail.url.href, slot: e.detail.slot, streaming: e.detail.streaming }));
    }
  });
});

test("gallery streams out of order, replays cached visits and restores history", async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/?topic=painting", { waitUntil: "commit" });
  await expect(page.locator(".table-card--loading")).toBeVisible();
  await expect(page.locator(".stream-dock")).toHaveAttribute("data-complete", "true");
  await expect(page.locator('[data-stream-count]')).toHaveText("4/4");
  await expect(page.locator('[data-timeline-slot="provenance-feed"]')).toHaveAttribute("data-state", "error");
  for (const topic of ["sculpture", "photograph", "sculpture"]) {
    await page.locator(`a[href="/?topic=${topic}"]`).click();
    await expect(page).toHaveURL(new RegExp(`topic=${topic}$`));
    await expect(page.locator(".stream-dock")).toHaveAttribute("data-complete", "true");
    await expect(page.locator(".object-table tbody tr")).toHaveCount(1);
  }
  await expect(page.locator(".track-note")).toHaveText("Completed response · cached or buffered");
  await expect(page.locator(".object-table tbody")).toContainText("Sculpture fixture");
  await page.goBack();
  await expect(page.locator("#panel-title")).toHaveText("Photographs");
  await expect(page.locator(".object-table tbody")).toContainText("Photograph fixture");
  await page.goForward();
  await expect(page.locator(".object-table tbody")).toContainText("Sculpture fixture");
  await expect(page.locator("[data-nativefragments-deferred-content]")).toHaveCount(0);
  expect(errors).toEqual([]);
  const samples = await page.evaluate(() => window.samples);
  const initial = samples.filter(x => x.name === "fragment-reveal").slice(0, 4);
  expect(initial.map(x => x.slot)).toEqual(["collection-stats", "provenance-feed", "featured-object", "artworks"]);
  await testInfo.attach("streaming-timings", { body: JSON.stringify({ browser: testInfo.project.name, samples }), contentType: "application/json" });
});

test("rapid navigation never lets cancelled gallery frames replace the final topic", async ({ page }) => {
  await page.goto("/?topic=painting&fast=1");
  // WebKit's automated click can wait for navigation-related I/O. Dispatch
  // subsequent native link clicks from the first swap event so every engine
  // supersedes a still-streaming response, regardless of runner speed.
  await page.evaluate(() => new Promise(resolve => {
    const topics = ["sculpture", "photograph", "textile"];
    const next = () => {
      const topic = topics.shift();
      if (topic) document.querySelector(`a[href="/?topic=${topic}"]`).click();
      else { document.removeEventListener("nativefragments:navigation-swap", next); resolve(); }
    };
    document.addEventListener("nativefragments:navigation-swap", next);
    next();
  }));
  await expect(page).toHaveURL(/topic=textile$/);
  await expect(page.locator(".stream-dock")).toHaveAttribute("data-complete", "true");
  await expect(page.locator(".object-table tbody")).toContainText("Textile fixture");
  await expect(page.locator("#panel-title")).toHaveText("Textiles");
  await expect(page.locator(".track-note")).toHaveText("One connection · out of order, fastest first");
  await expect(page.locator('[data-fragment-state="loading"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.samples.some(x => x.name === "navigation-abort"))).toBe(true);
});

test("gallery resolved HTML is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8923/?topic=painting&fast=1");
  await expect(page.locator('[data-fragment-fallback="artworks"]')).toContainText("Painting fixture");
  await expect(page.locator(".table-card--loading")).toBeHidden();
  await context.close();
});
