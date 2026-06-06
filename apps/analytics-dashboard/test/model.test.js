import assert from "node:assert/strict";
import test from "node:test";
import {
  renderAnalyticsBoard,
  resolveDashboardState,
  sectionForPath,
} from "../public/app/components/analytics-board-template.js";

test("sectionForPath resolves known demo routes and falls back to overview", () => {
  assert.equal(sectionForPath("/revenue").id, "revenue");
  assert.equal(sectionForPath("/revenue/").id, "revenue");
  assert.equal(sectionForPath("/missing").id, "overview");
});

test("range and segment selections scale count metrics deterministically", () => {
  const base = resolveDashboardState({
    range: "30d",
    section: "overview",
    segment: "all",
  });
  const narrow = resolveDashboardState({
    range: "7d",
    section: "overview",
    segment: "enterprise",
  });

  assert.equal(base.metrics[0].displayValue, "148.2k");
  assert.equal(narrow.metrics[0].displayValue, "13.1k");
  assert.equal(narrow.range.id, "7d");
  assert.equal(narrow.segment.id, "enterprise");
});

test("renderAnalyticsBoard marks the active controls and includes accessible regions", () => {
  const html = renderAnalyticsBoard({
    range: "90d",
    section: "reliability",
    segment: "team",
  });

  assert.match(html, /Reliability watch/);
  assert.match(html, /data-range="90d"[\s\S]*aria-pressed="true"/);
  assert.match(html, /data-segment="team"[\s\S]*aria-pressed="true"/);
  assert.match(html, /aria-label="Key metrics"/);
  assert.match(html, /role="table" aria-label="Primary channel performance"/);
});
