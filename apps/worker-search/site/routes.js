import { route } from "@nativefragments/core/server";
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../client/components/worker-search-app.js";
import { searchPayload, searchStats, visibleRows } from "./data/search-model.js";

const origin = "https://worker-search.nativefragments.org";
const description =
  "A Native Fragments demo that filters and sorts NASA meteorite landing data in a browser Worker through the built-in worker RPC helper.";

export const renderHome = async () => {
  const stats = searchStats();
  const rows = visibleRows({ limit: 12 });
  const state = { ...searchPayload(), initialRows: rows };
  const search = await renderLit(html`<worker-search-app
    data-state=${JSON.stringify(state)}
  ></worker-search-app>`);

  return `<section class="hero">
    <div>
      <p class="eyebrow">NASA Meteorite Landings · Worker RPC</p>
      <h1>A 45,000-row catalog you can search instantly.</h1>
      <p>The server streams the heaviest landings first; every keystroke after that is filtered and sorted off the main thread in a dedicated browser Web Worker.</p>
    </div>
    <div class="hero-meta">
      <span class="figure">${stats.records.toLocaleString()}</span>
      <span class="figure-label">records · ${stats.categories} classes</span>
    </div>
  </section>${search}`;
};

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description,
      title: "Worker Search · Native Fragments Demo",
    }),
    render: renderHome,
  }),
];
