import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.js";

test("worker renders the dashboard with declarative Shadow DOM", async () => {
  const response = await worker.fetch(
    new Request("https://analytics-dashboard.nativefragments.org/revenue"),
    {},
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(body, /<analytics-board/);
  assert.match(body, /shadowrootmode="open"/);
  assert.match(body, /Revenue command center/);
  assert.doesNotMatch(body, /<analytics-board><\/analytics-board>/);
});

test("fragment requests return the board panel without the full document shell", async () => {
  const response = await worker.fetch(
    new Request("https://analytics-dashboard.nativefragments.org/acquisition", {
      headers: {
        "x-fragment": "true",
        "x-fragment-slot": "dashboard-panel",
      },
    }),
    {},
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Acquisition command/);
  assert.match(body, /data-fragment-meta/);
  assert.doesNotMatch(body, /<!doctype html>/i);
  assert.doesNotMatch(body, /class="sidebar"/);
});
