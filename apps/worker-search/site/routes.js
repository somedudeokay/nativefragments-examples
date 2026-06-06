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
      <p class="eyebrow">Native Fragments Worker RPC</p>
      <h1>Large-list search without a UI framework.</h1>
      <p>
        This Cloudflare Worker serves 45,000+ real NASA meteorite records. The
        heaviest landings render on the server, then search and sorting move to
        a dedicated browser Worker.
      </p>
    </section>

    <worker-search-app>
      ${declarativeShadow({
        styles: [workerSearchStyles],
        html: renderSearchApp({ rows, stats }),
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
