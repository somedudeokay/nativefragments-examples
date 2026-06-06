import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.js";
import { routes, settingsPanel } from "../site/routes.js";

const appRequest = (path, headers = {}) =>
  worker.fetch(
    new Request(`https://nested-routes.nativefragments.org${path}`, {
      headers,
    }),
    {},
    {},
  );

test("registers the settings parent and child routes", () => {
  assert.deepEqual(
    routes.map((item) => item.path),
    [
      "/",
      "/settings/profile",
      "/settings/security",
      "/settings/notifications",
      "/settings/billing",
    ],
  );
  assert.equal(settingsPanel.name, "settings-panel");
  assert.equal(typeof routes[1].fragments["settings-panel"], "function");
});

test("renders a complete fallback document for a child route", async () => {
  const response = await appRequest("/settings/profile");
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(body, /<!doctype html>/);
  assert.match(body, /id="content-slot"/);
  assert.match(body, /data-fragment-slot="settings-panel"/);
  assert.match(body, /data-fragment-prefetch="load"/);
  assert.match(body, /data-panel="profile"/);
  assert.match(body, /href="\/settings\/security"/);
  assert.match(body, /nested-routes\.nativefragments\.org\/settings\/profile/);
});

test("renders only the requested nested child panel for a fragment request", async () => {
  const response = await appRequest("/settings/security", {
    "x-fragment": "true",
    "x-fragment-slot": "settings-panel",
  });
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.doesNotMatch(body, /<!doctype html>/);
  assert.doesNotMatch(body, /settings-sidebar/);
  assert.match(body, /data-panel="security"/);
  assert.match(body, /Security score/);
  assert.match(body, /data-fragment-meta/);
  assert.match(body, /Security · Nested Routes Demo/);
});

test("keeps direct routes and fragment routes aligned", async () => {
  const fullResponse = await appRequest("/settings/billing");
  const fragmentResponse = await appRequest("/settings/billing", {
    "x-fragment": "true",
    "x-fragment-slot": "settings-panel",
  });

  const fullBody = await fullResponse.text();
  const fragmentBody = await fragmentResponse.text();

  assert.match(fullBody, /data-panel="billing"/);
  assert.match(fragmentBody, /data-panel="billing"/);
  assert.match(fullBody, /Plan and usage/);
  assert.match(fragmentBody, /Plan and usage/);
});
