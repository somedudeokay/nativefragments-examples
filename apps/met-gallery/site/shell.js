import { attrs, html } from "@nativefragments/core/server";

const head = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <meta name="theme-color" content="#f4f1ea" />
  <link rel="stylesheet" href="/app/styles.css" />
  <script type="module" src="/build/client.js"></script>
`;

/**
 * Live stream-timeline telemetry. Records when each deferred fragment's
 * placeholder flips to ready/error (the reveal bootstrap sets
 * `data-fragment-state`) and paints the matching timeline row with its
 * client-perceived arrival time. Explicit lifecycle events reset navigation and
 * report completed reveals, including instant cache replay. Pure enhancement — the page is complete and
 * crawlable without it. Carries the CSP nonce so it survives a strict policy.
 */
const timelineScript = (nonce) => {
  return html`<script${attrs({ nonce })}>
(() => {
  let start = performance.now();
  const MAX = 1500;
  const fragmentRows = () =>
    document.querySelectorAll('[data-timeline-slot]:not([data-timeline-slot="shell"])');
  const updateDock = () => {
    const rows = fragmentRows();
    if (!rows.length) return;
    const done = [...rows].filter((r) => r.dataset.state !== "pending").length;
    const count = document.querySelector("[data-stream-count]");
    if (count) count.textContent = done + "/" + rows.length;
    const dock = document.querySelector(".stream-dock");
    if (dock) dock.dataset.complete = done === rows.length ? "true" : "false";
  };
  const paint = (slot, state, ms) => {
    const row = document.querySelector('[data-timeline-slot="' + slot + '"]');
    if (!row) return;
    row.dataset.state = state;
    const time = row.querySelector(".track-time");
    if (time) time.textContent = "+" + ms + "ms";
    const progress = row.querySelector(".track-progress");
    if (progress) progress.value = Math.max(45, Math.min(MAX, ms));
    updateDock();
  };
  const resetDock = () => {
    start = performance.now();
    for (const row of fragmentRows()) {
      row.dataset.state = "pending";
      const time = row.querySelector(".track-time");
      if (time) time.textContent = "streaming…";
      const progress = row.querySelector(".track-progress");
      if (progress) progress.value = 0;
    }
    updateDock();
  };
  let streamed = true;
  let activeNavigation;
  document.addEventListener("nativefragments:navigation-start", event => {
    if (event.detail.slot) return;
    activeNavigation = event.detail.id;
    resetDock();
  });
  document.addEventListener("nativefragments:navigation-swap", event => {
    if (event.detail.slot) return;
    streamed = event.detail.streaming;
    const note = document.querySelector(".track-note");
    if (note) note.textContent = streamed
      ? "One connection · out of order, fastest first"
      : "Completed response · cached or buffered";
  });
  document.addEventListener("nativefragments:fragment-reveal", event => {
    const { target, state } = event.detail;
    paint(target.getAttribute("data-fragment-slot"), state, Math.round(performance.now() - start));
  });
  document.addEventListener("nativefragments:navigation-abort", event => {
    if (event.detail.id !== activeNavigation) return;
    const note = document.querySelector(".track-note");
    if (note) note.textContent = "Navigation interrupted";
  });
})();
</script>`;
};

/**
 * Sticky stream-timeline dock. Part of the shell chrome (not the route body),
 * so it renders once, persists across client-side fragment navigation, and
 * streams in the first chunk — letting the telemetry observer populate it live.
 * `position: fixed` keeps it out of the document layout flow.
 */
const timelineRows = [
  { label: "Static shell", slot: "shell", state: "ready", time: "0ms" },
  { label: "Collection stats", slot: "collection-stats" },
  { label: "Provenance feed", slot: "provenance-feed" },
  { label: "Featured work", slot: "featured-object" },
  { label: "Artwork table", slot: "artworks" },
];

const timelineRow = (row) => html`<li
  class="track-row"
  data-timeline-slot="${row.slot}"
  data-state="${row.state ?? "pending"}"
>
  <span class="track-label">${row.label}</span>
  <span class="track-bar"
    ><progress
      class="track-progress"
      max="1500"
      value="${row.state === "ready" ? "45" : "0"}"
      aria-hidden="true"
    ></progress></span>
  <span class="track-time">${row.time ?? "streaming…"}</span>
</li>`;

const streamDock = () => html`<details class="stream-dock">
  <summary class="stream-dock-button">
    <span class="dock-dot" aria-hidden="true"></span>
    <span class="dock-label">Stream</span>
    <span class="dock-count" data-stream-count>0/4</span>
  </summary>
  <div class="stream-dock-panel">
    <div class="stream-dock-head">
      <p class="eyebrow">Stream timeline</p>
      <p class="track-note">One connection · out of order, fastest first</p>
    </div>
    <ol class="track-list">
      ${timelineRows.map(timelineRow)}
    </ol>
  </div>
</details>`;

const shellParts = ({ meta, nonce }) => ({
  before: html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    ${head({ meta })}
    ${timelineScript(nonce)}
  </head>
  <body>
    ${streamDock()}
    <main id="content-slot" class="workbench">`,
  after: html`</main>
  </body>
</html>`,
});

export const shell = ({ body, meta, nonce }) => {
  const parts = shellParts({ meta, nonce });
  if (body === undefined) return parts;

  return html`${parts.before}${body}${parts.after}`;
};
