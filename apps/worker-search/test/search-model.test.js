import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialRows } from "../site/data/records.js";
import {
  filterRecords,
  searchPayload,
  searchStats,
  visibleRows,
} from "../site/data/search-model.js";
import { filterRows } from "../public/app/search-core.js";

const records = JSON.parse(
  readFileSync(new URL("../public/app/data/meteorites.json", import.meta.url), "utf8"),
);

test("meteorite dataset is large and deterministic", () => {
  assert.equal(records.length, 45716);
  assert.deepEqual(records[0], {
    id: "met-1",
    name: "Aachen",
    title: "Aachen",
    recclass: "L5",
    classGroup: "L5",
    mass: 21,
    fall: "Fell",
    year: 1880,
    lat: 50.775,
    lon: 6.08333,
    region: "Northern / Eastern",
    category: "L5",
    score: 151,
    tags: ["Fell", "L5", "small", "1880"],
    summary: "Fell 1880 · L5 · 21 g · 50.77N, 6.08E",
  });
});

test("search stats summarize the dataset", () => {
  assert.deepEqual(searchStats(), {
    categories: 168,
    heaviest: 60000000,
    records: 45716,
    regions: 4,
  });
});

test("filterRows ranks and limits matching meteorites", () => {
  const result = filterRows({
    limit: 5,
    query: "lunar",
    rows: records,
    sort: "mass",
  });

  assert.equal(result.query, "lunar");
  assert.equal(result.results.length, 5);
  assert.equal(result.sort, "mass");
  assert.ok(result.total > 150);
  assert.deepEqual(
    result.results.slice(0, 2).map((row) => row.name),
    ["Kalahari 009", "Northwest Africa 5000"],
  );
});

test("server model uses the same filter core as the worker", () => {
  assert.deepEqual(filterRecords({ limit: 8 }), initialRows.slice(0, 8));
  assert.deepEqual(
    visibleRows({ limit: 3 }).map((row) => row.id),
    ["met-11890", "met-5262", "met-5247"],
  );
  assert.deepEqual(searchPayload(), {
    dataUrl: "/app/data/meteorites.json",
    initialRows,
    stats: searchStats(),
  });
});
