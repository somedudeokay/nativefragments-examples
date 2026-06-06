import test from "node:test";
import assert from "node:assert/strict";
import { records } from "../site/data/records.js";
import {
  filterRecords,
  searchPayload,
  searchStats,
  visibleRows,
} from "../site/data/search-model.js";
import { filterRows } from "../public/app/search-core.js";

test("generated dataset is large and deterministic", () => {
  assert.equal(records.length, 2400);
  assert.deepEqual(records[0], {
    id: "wf-0001",
    title: "Oslo routing queue",
    owner: "Platform",
    region: "Oslo",
    category: "routing",
    score: 42,
    tags: ["edge", "fragment"],
    summary: "Entry 0001 models routing queue work for platform teams at the edge.",
  });
});

test("search stats summarize the dataset", () => {
  assert.deepEqual(searchStats(), {
    categories: 10,
    records: 2400,
    regions: 10,
  });
});

test("filterRows ranks and limits matching records", () => {
  const result = filterRows({
    limit: 5,
    query: "oslo routing",
    rows: records,
  });

  assert.equal(result.query, "oslo routing");
  assert.equal(result.results.length, 5);
  assert.equal(result.total, 240);
  assert.ok(result.results.every((row) => row.title.toLowerCase().includes("oslo routing")));
});

test("server model uses the same filter core as the worker", () => {
  assert.deepEqual(
    filterRecords({ query: "identity", limit: 8 }),
    filterRows({ rows: records, query: "identity", limit: 8 }).results,
  );
  assert.deepEqual(
    visibleRows({ limit: 3 }).map((row) => row.id),
    ["wf-0018", "wf-0076", "wf-0134"],
  );
  assert.equal(searchPayload(), records);
});
