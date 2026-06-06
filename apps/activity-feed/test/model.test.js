import assert from "node:assert/strict";
import test from "node:test";
import { events, feedSummary, filterEvents, normalizeFilter } from "../site/model.js";

test("unknown filters normalize to all", () => {
  assert.equal(normalizeFilter("shipping"), "all");
});

test("feed filters only matching event kinds", () => {
  assert.equal(filterEvents("deploys").every((event) => event.kind === "deploys"), true);
  assert.equal(feedSummary("all").total, events.length);
});
