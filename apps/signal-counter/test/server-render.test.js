import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { homePage } from "../site/pages/home.js";
import { routes } from "../site/routes.js";
import { shell } from "../site/shell.js";
import { signalCounterElement } from "../site/templates/signal-counter.js";

describe("server rendering", () => {
  it("renders the visible counter with declarative shadow dom", () => {
    const html = signalCounterElement();

    assert.match(html, /<signal-counter count="0" step="1">/);
    assert.match(html, /<template shadowrootmode="open">/);
    assert.match(html, /data-bind="count"/);
    assert.match(html, /data-bind="history"/);
    assert.doesNotMatch(html, /<signal-counter><\/signal-counter>/);
  });

  it("renders a complete document shell with client modules", () => {
    const route = routes.find((item) => item.path === "/");
    const meta = route.meta();
    const body = homePage();
    const document = shell({ body, meta });

    assert.match(document, /<!doctype html>/);
    assert.match(document, /<main id="content-slot">/);
    assert.match(document, /<signal-counter count="0" step="1">/);
    assert.doesNotMatch(document, /&lt;signal-counter/);
    assert.match(document, /<script type="module" src="\/app\/client\.js"><\/script>/);
    assert.match(document, /<link rel="canonical" href="https:\/\/signal-counter\.nativefragments\.org\/" \/>/);
  });
});
