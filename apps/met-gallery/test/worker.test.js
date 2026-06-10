import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker.js";

const artworkData = {
  111628: {
    artist_display: "Edward Hopper (American, 1882-1967)",
    date_display: "1942",
    department_title: "Arts of the Americas",
    description: "<p>About <em>Nighthawks</em>, a late-night diner scene.</p>",
    id: 111628,
    image_id: "831a05de-d3f6-f4fa-a460-23008dd58dda",
    is_on_view: true,
    medium_display: "Oil on canvas",
    title: "Nighthawks",
  },
  28560: {
    artist_display: "Vincent van Gogh (Dutch, 1853-1890)",
    date_display: "1889",
    department_title: "Painting and Sculpture of Europe",
    description: "<p>Van Gogh's bedroom in Arles.</p>",
    id: 28560,
    image_id: "25c31d8d-21a4-9ea1-1d73-6a2eca4dda7e",
    is_on_view: false,
    medium_display: "Oil on canvas",
    title: "The Bedroom",
  },
};

const withAicMock = async (callback) => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input) => {
    const url = new URL(String(input));

    if (url.pathname.endsWith("/artworks/search")) {
      return Response.json({ pagination: { total: 4063 }, data: Object.values(artworkData) });
    }

    const id = url.pathname.match(/\/artworks\/(\d+)$/)?.[1];
    if (id && artworkData[id]) {
      return Response.json({ data: artworkData[id] });
    }

    return new Response("Not found", { status: 404 });
  };

  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
};

const appRequest = (path, headers = {}) =>
  worker.fetch(
    new Request(`https://met-gallery.nativefragments.org${path}`, { headers }),
    {},
    {},
  );

test("streams the static shell, sticky dock, and loading placeholders before resolving", async () => {
  await withAicMock(async () => {
    const response = await appRequest("/?topic=painting&fast=1");
    const body = await response.text();
    const csp = response.headers.get("Content-Security-Policy");

    assert.equal(response.status, 200);

    // strict CSP + a single nonce'd reveal bootstrap (no per-fragment scripts)
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /script-src 'self' 'nonce-[^']+'/);
    assert.match(body, /<script nonce="[^"]+" data-nativefragments-deferred-bootstrap>/);

    // static shell + sticky stream-timeline dock (out of layout flow)
    assert.match(body, /Collection Control/);
    assert.match(body, /class="layout-grid"/);
    assert.match(body, /class="stream-dock"/);
    assert.match(body, /data-timeline-slot="shell"/);
    assert.match(body, /data-timeline-slot="collection-stats"/);
    assert.match(body, /data-timeline-slot="provenance-feed"/);
    assert.match(body, /data-timeline-slot="artworks"/);

    // four loading placeholders are present in the stream
    assert.match(body, /class="stats-card stats-card--loading"/);
    assert.match(body, /class="table-card table-card--loading"/);
    assert.match(body, /Loading rows/);
    assert.match(body, /Paintings/);
  });
});

test("resolves multiple deferred fragments as real DOM, out of order", async () => {
  await withAicMock(async () => {
    const response = await appRequest("/?topic=painting&fast=1");
    const body = await response.text();

    // real DOM content, not inert templates
    assert.doesNotMatch(body, /<template data-nativefragments-deferred-fragment/);
    assert.match(body, /data-nativefragments-deferred-content="nf-collection-stats-\d+"/);
    assert.match(body, /data-nativefragments-deferred-content="nf-featured-object-\d+"/);
    assert.match(body, /data-nativefragments-deferred-content="nf-artworks-\d+"/);

    // each fragment's content resolved server-side
    assert.match(body, /Artworks/); // stats tile
    assert.match(body, /class="featured-card"/); // featured
    assert.match(body, /Nighthawks/); // featured + table
    assert.match(body, /The Bedroom/); // table
    assert.match(body, /data-fragment-state="ready"/);
  });
});

test("a failing fragment streams its error boundary without breaking the page", async () => {
  await withAicMock(async () => {
    const response = await appRequest("/?topic=painting&fast=1");
    const body = await response.text();

    assert.equal(response.status, 200);

    // the provenance fragment errors into its boundary…
    assert.match(
      body,
      /data-nativefragments-deferred-content="nf-provenance-feed-\d+" data-fragment-state="error"/,
    );
    assert.match(body, /Provenance feed failed/);

    // …while the other fragments still resolve
    assert.match(body, /The Bedroom/);
    assert.match(body, /Artworks/);
  });
});

test("example avoids transform-based deferred enter motion", async () => {
  const css = await readFile(new URL("../public/app/styles.css", import.meta.url), "utf8");

  assert.doesNotMatch(css, /table-in/);
  assert.doesNotMatch(css, /\btranslate(?:3d|X|Y)?\(/);
  assert.doesNotMatch(css, /\bscale(?:3d|X|Y)?\(/);
});

test("default-slot fragment navigation returns the buffered page (SPA nav path)", async () => {
  await withAicMock(async () => {
    const response = await appRequest("/?topic=painting&fast=1", { "x-fragment": "true" });
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Collection Control/); // header swaps in with the content
    assert.match(body, /class="layout-grid"/);
    assert.match(body, /Nighthawks/); // fragments resolved server-side (buffered)
    assert.match(body, /data-fragment-meta/);
    assert.doesNotMatch(body, /<!doctype html>/i); // a fragment, not a full document
    assert.doesNotMatch(body, /stats-card--loading/); // buffered → no loading placeholder
    assert.doesNotMatch(body, /data-nativefragments-deferred-content/); // inlined, not streamed
  });
});

test("named fragment requests return only the completed table rows", async () => {
  await withAicMock(async () => {
    const response = await appRequest("/?topic=painting&fast=1", {
      "x-fragment": "true",
      "x-fragment-slot": "artworks",
    });
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Nighthawks/);
    assert.match(body, /The Bedroom/);
    assert.match(body, /data-fragment-meta/);
    assert.doesNotMatch(body, /table-card--loading/);
    assert.doesNotMatch(body, /data-nativefragments-deferred-content/);
    assert.doesNotMatch(body, /<!doctype html>/i);
  });
});
