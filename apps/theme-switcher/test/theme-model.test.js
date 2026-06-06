import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_THEME,
  THEMES,
  resolveTheme,
  themeRootCss,
  themeScriptAllowList,
} from "../public/app/theme-model.js";

test("default theme resolves to a complete theme", () => {
  const theme = resolveTheme(DEFAULT_THEME);

  assert.equal(theme.id, DEFAULT_THEME);
  assert.equal(typeof theme.label, "string");
  assert.ok(theme.tokens["--app-bg"]);
  assert.ok(theme.tokens["--app-surface"]);
  assert.ok(theme.tokens["--app-ink"]);
  assert.ok(theme.tokens["--app-accent"]);
});

test("unknown theme ids fall back to the default theme", () => {
  assert.equal(resolveTheme("missing").id, DEFAULT_THEME);
  assert.equal(resolveTheme(null).id, DEFAULT_THEME);
});

test("theme css exposes every theme as root custom properties", () => {
  const css = themeRootCss();

  for (const theme of THEMES) {
    assert.match(css, new RegExp(`:root\\[data-theme="${theme.id}"\\]`));
    for (const name of Object.keys(theme.tokens)) {
      assert.match(css, new RegExp(`${name}:`));
    }
  }
});

test("browser allow list contains only known theme ids", () => {
  assert.deepEqual(
    themeScriptAllowList(),
    THEMES.map((theme) => theme.id),
  );
});
