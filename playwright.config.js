import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "**/*.spec.js", timeout: 30_000,
  outputDir: "test-results/traces",
  fullyParallel: true, workers: process.env.CI ? 2 : 3, retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/gallery.json" }]],
  use: { baseURL: "http://127.0.0.1:8923", trace: "retain-on-failure" },
  webServer: { command: "npm run build -w apps/met-gallery && node tests/gallery-server.mjs", url: "http://127.0.0.1:8923/health", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
