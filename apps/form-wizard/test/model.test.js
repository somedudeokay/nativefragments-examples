import assert from "node:assert/strict";
import test from "node:test";
import { currentStep, nextStep, progress } from "../site/model.js";

test("unknown steps fall back to the first wizard step", () => {
  assert.equal(currentStep("missing").id, "profile");
});

test("progress advances through the route-backed steps", () => {
  assert.equal(nextStep("profile").id, "preferences");
  assert.equal(progress("review"), 100);
});
