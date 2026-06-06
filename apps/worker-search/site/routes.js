import { declarativeShadow, html, raw, route } from "@nativefragments/core/server";
import { searchPayload, searchStats, visibleRows } from "./data/search-model.js";
import {
  renderSearchApp,
  serializeSearchState,
  workerSearchStyles,
} from "../public/app/components/worker-search-app-template.js";

const origin = "https://worker-search.nativefragments.org";
const description =
  "A Native Fragments demo that filters and sorts NASA meteorite landing data in a browser Worker through the built-in worker RPC helper.";

export const renderHome = () => {
  const stats = searchStats();
  const rows = visibleRows({ limit: 12 });
  const state = serializeSearchState(searchPayload());

  return html`
    <section class="hero">
      <div>
        <p class="eyebrow">NASA Meteorite Landings · Worker RPC</p>
        <h1>A 45,000-row catalog you can search instantly.</h1>
        <p>
          The server streams the heaviest landings first; every keystroke after
          that is filtered and sorted off the main thread in a dedicated browser
          Web Worker — no UI framework, no blocked paint.
        </p>
      </div>
      <div class="hero-meta">
        <span class="figure">${raw(stats.records.toLocaleString())}</span>
        <span class="figure-label">records · ${raw(String(stats.categories))} classes</span>
      </div>
    </section>

    <worker-search-app>
      ${declarativeShadow({
        styles: [workerSearchStyles],
        html: renderSearchApp({ rows, stats, sort: "mass" }),
      })}
      <script type="application/json" data-search-state>${raw(state)}</script>
    </worker-search-app>
  `;
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
