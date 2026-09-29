import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { examples } from "./examples.mjs";

const browser = await chromium.launch();
const results = [];
try {
  for (const { url } of [
    { url: "https://nativefragments.org" }, { url: "https://docs.nativefragments.org" },
    { url: "https://task-board.nativefragments.org/login" }, ...examples,
  ]) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    assert.equal(response.status(), 200, url);
    await page.locator("h1").first().waitFor();
    await page.waitForFunction(() => !document.querySelector('[data-fragment-state="loading"]'));
    assert.deepEqual(errors, [], url);
    results.push({ url, status: response.status(), title: await page.title(), pageErrors: errors });
    console.log(`PASS ${url}`);
    await page.close();
  }
} finally {
  await browser.close();
  await mkdir("test-results", { recursive: true });
  await writeFile("test-results/production.json", JSON.stringify(results, null, 2));
}
