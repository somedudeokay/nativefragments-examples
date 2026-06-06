import assert from "node:assert/strict";
import test from "node:test";
import { articleBySlug, articles, readingMinutes } from "../site/content.js";

test("unknown slugs return a stable fallback article", () => {
  assert.equal(articleBySlug("missing").slug, articles[0].slug);
});

test("reading time never drops below one minute", () => {
  assert.equal(readingMinutes({ body: ["short note"] }), 1);
});
