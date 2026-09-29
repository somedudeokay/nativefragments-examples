import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.js";
import { renderHome } from "../site/routes.js";

test("home route server-renders the worker search custom element", async () => {
  const html = await renderHome();

  assert.match(html, /<worker-search-app\s/);
  assert.match(html, /<template shadowroot="open" shadowrootmode="open">/);
  assert.match(html, /data-state=/);
  assert.match(html, /Server rendered <b>12<\/b> rows before JavaScript/);
  assert.match(html, /Search 45,716 real meteorites/);
  assert.match(html, /@nativefragments\/core worker RPC/);
  assert.match(html, /<table data-search-table>/);
  assert.match(html, /data-sort-col="mass"/);
});

test("cloudflare handler returns a complete document", async () => {
  const response = await worker.fetch(new Request("https://worker-search.nativefragments.org/"), {});
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.match(html, /<title>Worker Search · Native Fragments Demo<\/title>/);
  assert.match(html, /<script type="module" src="\/build\/client\.js"><\/script>/);
  assert.match(html, /<worker-search-app\s/);
});
