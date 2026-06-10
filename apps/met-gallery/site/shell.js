import { html, raw } from "@nativefragments/core/server";

const head = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <meta name="theme-color" content="#f4f1ea" />
  <link rel="stylesheet" href="/app/styles.css" />
  <script type="module" src="/app/client.js"></script>
`;

/**
 * Live stream-timeline telemetry. Records when each deferred fragment's
 * placeholder flips to ready/error (the reveal bootstrap sets
 * `data-fragment-state`) and paints the matching timeline row with its
 * client-perceived arrival time. Exposes `__nfStreamMarkBuffered` so client-side
 * navigation (buffered fragments, no live stream) can refresh the dock. Pure
 * enhancement — the page is complete and crawlable without it. Carries the CSP
 * nonce so it survives a strict policy.
 */
const timelineScript = (nonce) => {
  const nonceAttr = nonce ? ` nonce="${nonce}"` : "";

  return html`<script${raw(nonceAttr)}>
(() => {
  const start = performance.now();
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
    const fill = row.querySelector(".track-fill");
    if (fill) fill.style.width = Math.max(3, Math.min(100, Math.round((ms / MAX) * 100))) + "%";
    updateDock();
  };
  // Client navigation swaps in already-resolved (buffered) fragments, so reflect
  // their final state in the dock instead of leaving stale first-load timings.
  window.__nfStreamMarkBuffered = () => {
    for (const row of fragmentRows()) {
      const slot = row.getAttribute("data-timeline-slot");
      const el = document.querySelector('[data-fragment-slot="' + slot + '"]');
      row.dataset.state = el?.getAttribute("data-fragment-state") === "error" ? "error" : "ready";
      const time = row.querySelector(".track-time");
      if (time) time.textContent = "buffered";
      const fill = row.querySelector(".track-fill");
      if (fill) fill.style.width = "100%";
    }
    updateDock();
  };
  new MutationObserver((records) => {
    for (const record of records) {
      const el = record.target;
      if (el.nodeType !== 1 || !el.hasAttribute("data-fragment-slot")) continue;
      const state = el.getAttribute("data-fragment-state");
      if (state === "ready" || state === "error") {
        paint(el.getAttribute("data-fragment-slot"), state, Math.round(performance.now() - start));
      }
    }
  }).observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-fragment-state"],
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
    ><span class="track-fill" style="width: ${row.state === "ready" ? "3%" : "0"}"></span
  ></span>
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
      ${raw(timelineRows.map(timelineRow).join(""))}
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
    ${raw(head({ meta }))}
    ${raw(timelineScript(nonce))}
  </head>
  <body>
    ${raw(streamDock())}
    <main id="content-slot" class="workbench">`,
  after: html`</main>
  </body>
</html>`,
});

export const shell = ({ body, meta, nonce }) => {
  const parts = shellParts({ meta, nonce });
  if (body === undefined) return parts;

  return html`${raw(parts.before)}${raw(body)}${raw(parts.after)}`;
};
