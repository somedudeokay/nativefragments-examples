import { html, route } from "@nativefragments/core/server";
import { endpoints, summary } from "./model.js";

const origin = "https://worker-api.nativefragments.org";

const endpointRows = () =>
  endpoints.map(
    (endpoint) => html`<tr>
      <td><code>${endpoint.method}</code></td>
      <td><a href="${endpoint.path}" data-nativefragments-reload><code>${endpoint.path}</code></a></td>
      <td>${endpoint.purpose}</td>
    </tr>`,
  );

const homePage = () => {
  const stats = summary();

  return html`<section class="hero">
    <p class="eyebrow">Worker API</p>
    <h1>Pages and JSON from the same Worker.</h1>
    <p>
      This demo passes a tiny Web Standards API object into the Native
      Fragments Cloudflare adapter. No Hono, no build step, no router
      dependency.
    </p>
  </section>

  <section class="stats" aria-label="API summary">
    <article><strong>${stats.runtime}</strong><span>Runtime</span></article>
    <article><strong>${stats.endpoints}</strong><span>Endpoints</span></article>
    <article><strong>${stats.testRunner}</strong><span>Unit tests</span></article>
  </section>

  <section class="panel">
    <div>
      <p class="eyebrow">Endpoints</p>
      <h2>Native fetch handlers.</h2>
    </div>
    <table>
      <thead>
        <tr><th>Method</th><th>Path</th><th>Purpose</th></tr>
      </thead>
      <tbody>${endpointRows()}</tbody>
    </table>
  </section>`;
};

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description:
        "A Native Fragments demo showing platform-native Worker JSON endpoints and server-rendered pages.",
      title: "Worker API · Native Fragments Demo",
    }),
    render: homePage,
  }),
];
