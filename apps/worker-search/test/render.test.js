import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.js";
import { renderHome } from "../site/routes.js";

test("home route server-renders the worker search custom element", () => {
  const html = renderHome();

  assert.match(html, /<worker-search-app>/);
  assert.match(html, /<template shadowrootmode="open">/);
  assert.match(html, /data-search-state/);
  assert.match(html, /Server rendered 12 rows before JavaScript/);
  assert.match(html, /\/nativefragments\/worker\.js RPC/);
});

test("cloudflare handler returns a complete document", async () => {
  const response = await worker.fetch(new Request("https://worker-search.nativefragments.org/"), {});
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.match(html, /<title>Worker Search · Native Fragments Demo<\/title>/);
  assert.match(html, /<script type="module" src="\/app\/client\.js"><\/script>/);
  assert.match(html, /<worker-search-app>/);
});
