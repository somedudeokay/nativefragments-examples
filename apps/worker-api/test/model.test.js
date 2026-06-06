import assert from "node:assert/strict";
import test from "node:test";
import { endpoints, summary } from "../site/model.js";

test("summary reports endpoint count from the shared endpoint model", () => {
  assert.equal(summary().endpoints, endpoints.length);
  assert.deepEqual(summary().dependencies, ["@nativefragments/core"]);
});
