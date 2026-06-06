import { html, raw, route } from "@nativefragments/core/server";
import { endpoints, sampleResponses, summary } from "./model.js";

const origin = "https://worker-api.nativefragments.org";

const methodBadge = (method) =>
  html`<span class="method method--${method.toLowerCase()}">${method}</span>`;

const endpointRows = () =>
  endpoints.map(
    (endpoint, index) => html`<tr id="ep-${index}">
      <td class="ep-method">${raw(methodBadge(endpoint.method))}</td>
      <td class="ep-path">
        <a href="${endpoint.path}" data-nativefragments-reload><code>${endpoint.path}</code></a>
      </td>
      <td class="ep-purpose">${endpoint.purpose}</td>
    </tr>`,
  );

const jsonLines = (value) =>
  JSON.stringify(value, null, 2)
    .split("\n")
    .map((line) => {
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";
      const rest = line.slice(indent.length);
      const decorated = rest
        .replace(
          /^("[^"]*")(\s*:)/,
          '<span class="tok-key">$1</span>$2',
        )
        .replace(
          /(:\s*)("[^"]*")/,
          '$1<span class="tok-str">$2</span>',
        )
        .replace(
          /(:\s*)(true|false|null)/g,
          '$1<span class="tok-bool">$2</span>',
        )
        .replace(
          /(:\s*)(-?\d+(?:\.\d+)?)/g,
          '$1<span class="tok-num">$2</span>',
        );
      return `<span class="jline">${indent.replace(/ /g, "&nbsp;")}${decorated}</span>`;
    })
    .join("");

const responsePanel = (path, body) => html`<article class="response" id="res-${path.replace(/\W+/g, "-")}">
  <header class="response__head">
    <div class="response__meta">
      <span class="method method--get">GET</span>
      <code class="response__path">${path}</code>
    </div>
    <span class="status status--ok"><span class="status__dot" aria-hidden="true"></span>200 OK</span>
  </header>
  <pre class="response__body" tabindex="0" aria-label="JSON response for ${path}"><code>${raw(jsonLines(body))}</code></pre>
</article>`;

const homePage = () => {
  const stats = summary();

  return html`<header class="masthead">
    <div class="masthead__brand">
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 17l6-6-6-6" />
          <path d="M12 19h8" />
        </svg>
      </span>
      <div>
        <p class="logo__name">Worker API</p>
        <p class="logo__sub">Native Fragments reference</p>
      </div>
    </div>
    <nav class="masthead__nav" aria-label="Runtime details">
      <span class="chip"><span class="chip__k">Runtime</span> ${stats.runtime}</span>
      <span class="chip"><span class="chip__k">Tests</span> ${stats.testRunner}</span>
      <span class="chip chip--live"><span class="chip__dot" aria-hidden="true"></span>${stats.endpoints} endpoints live</span>
    </nav>
  </header>

  <section class="intro">
    <p class="eyebrow">API Reference · stable</p>
    <h1>One Worker. Pages <em>and</em> JSON.</h1>
    <p class="lede">
      A tiny Web Standards <code>fetch</code> handler serves server-rendered HTML and
      typed JSON from the same model — no Hono, no build step, no router dependency.
      Every endpoint below returns live data from <code>site/model.js</code>.
    </p>
  </section>

  <div class="docs">
    <section class="endpoints" aria-labelledby="endpoints-title">
      <div class="section-head">
        <h2 id="endpoints-title">Endpoints</h2>
        <p class="section-sub">Base URL <code>${origin}</code></p>
      </div>
      <table class="ep-table">
        <thead>
          <tr><th scope="col">Method</th><th scope="col">Path</th><th scope="col">Description</th></tr>
        </thead>
        <tbody>${raw(endpointRows().join(""))}</tbody>
      </table>

      <div class="callout">
        <h3>Same model, two surfaces</h3>
        <p>
          The endpoint count, runtime, and dependency list on this page are read
          from the identical export that powers <code>/api/summary</code>. Change the
          model once and both the HTML and the JSON stay in sync.
        </p>
      </div>
    </section>

    <aside class="preview" aria-label="Example responses">
      <p class="preview__label">Response preview</p>
      ${raw(responsePanel("/api/health", sampleResponses.health))}
      ${raw(responsePanel("/api/summary", sampleResponses.summary))}
    </aside>
  </div>`;
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
