import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { homePage } from "../site/pages/home.js";
import { routes } from "../site/routes.js";
import { shell } from "../site/shell.js";
import { litCounterElement } from "../site/templates/signal-counter.js";

describe("server rendering", () => {
  it("renders the visible counter with declarative shadow dom", async () => {
    const html = String(await litCounterElement());

    assert.match(html, /<lit-counter\s+count="0" step="1">/);
    assert.match(html, /<template shadowroot="open" shadowrootmode="open">/);
    assert.match(html, /data-bind="count"/);
    assert.match(html, /data-bind="history"/);
    assert.doesNotMatch(html, /<lit-counter><\/lit-counter>/);
  });

  it("renders a complete document shell with client modules", async () => {
    const route = routes.find((item) => item.path === "/");
    const meta = route.meta();
    const body = await homePage();
    const document = String(shell({ body, meta }));

    assert.match(document, /<!doctype html>/);
    assert.match(document, /<main id="content-slot">/);
    assert.match(document, /<lit-counter\s+count="0" step="1">/);
    assert.doesNotMatch(document, /&lt;lit-counter/);
    assert.match(document, /<script type="module" src="\/build\/client\.js"><\/script>/);
    assert.match(document, /<link rel="canonical" href="https:\/\/lit-counter\.nativefragments\.org\/" \/>/);
  });
});
