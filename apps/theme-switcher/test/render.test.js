import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.js";
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEMES,
} from "../public/app/theme-model.js";
import {
  themeSwitcherHtml,
  themeSwitcherStyles,
} from "../public/app/components/theme-switcher-template.js";

test("worker renders the theme switcher with declarative shadow dom", async () => {
  const response = await worker.fetch(
    new Request("https://theme-switcher.nativefragments.org/"),
    {},
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /<theme-switcher/);
  assert.match(body, /<template shadowrootmode="open">/);
  assert.match(body, /data-theme-option="dawn"/);
  assert.match(body, /data-theme-option="night"/);
  assert.match(body, /data-theme-option="field"/);
  assert.match(body, /data-theme-option="contrast"/);
  assert.match(body, /<script type="module" src="\/app\/client.js"><\/script>/);
});

test("shell includes persisted-theme boot script before app css", async () => {
  const response = await worker.fetch(
    new Request("https://theme-switcher.nativefragments.org/"),
    {},
    {},
  );
  const body = await response.text();
  const storageIndex = body.indexOf(STORAGE_KEY);
  const styleIndex = body.indexOf('<link rel="stylesheet" href="/app/styles.css"');

  assert.ok(storageIndex > -1);
  assert.ok(styleIndex > -1);
  assert.ok(storageIndex < styleIndex);
  assert.match(body, new RegExp(`<html lang="en" data-theme="${DEFAULT_THEME}">`));
});

test("shared component template exposes controls and css variables", () => {
  const markup = themeSwitcherHtml({
    selectedTheme: DEFAULT_THEME,
    themes: THEMES,
  });

  assert.match(markup, /role="radiogroup"/);
  assert.match(markup, /data-current-theme/);
  assert.match(markup, /var\(--app-accent\)/);
  assert.match(themeSwitcherStyles, /var\(--app-bg\)/);
  assert.match(themeSwitcherStyles, /var\(--app-surface\)/);
  assert.match(themeSwitcherStyles, /var\(--app-ink\)/);
});
