import { fragment, html, raw, route } from "@nativefragments/core/server";
import {
  collectionForTopic,
  loadArtworks,
  loadCollectionStats,
  loadFeaturedObject,
  loadProvenance,
  topicForUrl,
  topics,
} from "./met-api.js";

const origin = "https://met-gallery.nativefragments.org";

const formatCount = (value) => new Intl.NumberFormat("en-US").format(value);

const topicLink = ({ active, topic }) => html`<a
  class="topic-link ${active === topic.id ? "is-active" : ""}"
  href="/?topic=${topic.id}"
  aria-current="${active === topic.id ? "page" : "false"}"
>
  <span>${topic.accent}</span>
  <strong>${topic.label}</strong>
</a>`;

/* -------------------------------------------------------- collection stats */

const statTile = (label, value) => html`<div class="stat-tile">
  <span class="stat-tile-label">${label}</span>
  <strong class="stat-tile-value">${value}</strong>
</div>`;

const statsSkeleton = () => html`<div class="stats-card stats-card--loading" aria-hidden="true">
  <div class="stats-grid">
    ${raw(
      Array.from(
        { length: 3 },
        () => html`<div class="stat-tile">
          <span class="sk sk-stat-label"></span>
          <span class="sk sk-stat-value"></span>
        </div>`,
      ).join(""),
    )}
  </div>
</div>`;

const statsCard = (data) => html`<div class="stats-card">
  <div class="stats-grid">
    ${raw(statTile("Artworks", formatCount(data.total)))}
    ${raw(statTile("On view", `${data.onView}/${data.sample}`))}
    ${raw(statTile("With image", `${data.withImages}/${data.sample}`))}
  </div>
</div>`;

export const collectionStats = fragment("collection-stats", {
  loading: statsSkeleton,
  render: async (context) =>
    statsCard(await loadCollectionStats(context.url, { signal: context.signal })),
});

/* --------------------------------------------------------- featured work */

const featuredSkeleton = () => html`<figure class="featured-card featured-card--loading" aria-hidden="true">
  <span class="sk sk-featured-image"></span>
  <figcaption class="featured-body">
    <span class="sk sk-featured-title"></span>
    <span class="sk sk-featured-line"></span>
    <span class="sk sk-featured-line is-short"></span>
  </figcaption>
</figure>`;

const featuredCard = (data) => html`<figure class="featured-card">
  <img
    class="featured-image"
    src="${data.image}"
    alt="${data.title}"
    loading="lazy"
    width="843"
    height="632"
  />
  <figcaption class="featured-body">
    <p class="eyebrow">Featured · ${data.department}</p>
    <h3 class="featured-title">${data.title}</h3>
    <p class="featured-meta">${data.artist} · ${data.date}</p>
    <p class="featured-medium">${data.medium}</p>
    ${data.description ? html`<p class="featured-desc">${data.description}</p>` : ""}
    <p class="featured-links">
      <a href="${data.objectUrl}" data-nativefragments-reload>View at the Art Institute</a>
    </p>
  </figcaption>
</figure>`;

const featuredError = () => html`<div class="panel-error" role="status">
  <p class="eyebrow">Highlight unavailable</p>
  <p>The featured work could not be loaded. The rest of the page is unaffected.</p>
</div>`;

export const featuredObject = fragment("featured-object", {
  loading: featuredSkeleton,
  error: featuredError,
  render: async (context) =>
    featuredCard(await loadFeaturedObject(context.url, { signal: context.signal })),
});

/* --------------------------------------------------------- provenance feed */

const provenanceSkeleton = () => html`<div class="provenance-card provenance-card--loading" aria-hidden="true">
  <span class="sk sk-prov-line"></span>
  <span class="sk sk-prov-line"></span>
  <span class="sk sk-prov-line is-short"></span>
</div>`;

const provenanceError = () => html`<div class="panel-error provenance-error" role="status">
  <p class="eyebrow">⚠ Provenance feed failed</p>
  <h3>This region hit an error.</h3>
  <p>
    Its <code>error()</code> boundary streamed in place while every other fragment
    resolved normally — one broken region does not break the page.
  </p>
</div>`;

export const provenanceFeed = fragment("provenance-feed", {
  loading: provenanceSkeleton,
  error: provenanceError,
  render: async (context) => {
    await loadProvenance(context.url);
    return "";
  },
});

/* ----------------------------------------------------------- artwork table */

const tableSkeletonRows = Array.from({ length: 8 }, () => html`<tr>
  <td><span class="sk sk-title"></span></td>
  <td><span class="sk sk-maker"></span></td>
  <td><span class="sk sk-date"></span></td>
  <td><span class="sk sk-medium"></span></td>
</tr>`);

const tableMeta = ({ label, value }) => html`<div class="table-meta">
  <p class="eyebrow">${label}</p>
  <strong>${value}</strong>
</div>`;

const tableSkeleton = ({ url }) => {
  const collection = collectionForTopic(topicForUrl(url));

  return html`<div class="table-card table-card--loading" aria-hidden="true">
  ${raw(tableMeta({ label: collection.label, value: "Loading rows" }))}
  <table class="object-table">
    <thead>
      <tr>
        <th>Work</th>
        <th>Maker</th>
        <th>Date</th>
        <th>Medium</th>
      </tr>
    </thead>
    <tbody>
      ${raw(tableSkeletonRows.join(""))}
    </tbody>
  </table>
</div>`;
};

const tableError = () => html`<div class="table-card panel-error" role="status">
  <p class="eyebrow">Remote data unavailable</p>
  <h3>The artwork table could not be rendered.</h3>
  <p>The shell remains usable while the deferred server-side data source fails.</p>
</div>`;

const objectRow = (row) => html`<tr>
  <td>
    <a href="${row.objectUrl}" data-nativefragments-reload>${row.title}</a>
  </td>
  <td>${row.artist}</td>
  <td>${row.date}</td>
  <td>${row.medium}</td>
</tr>`;

const objectTable = (data) => html`<div class="table-card">
  ${raw(tableMeta({ label: data.label, value: `${data.rows.length} of ${formatCount(data.total)}` }))}
  <table class="object-table">
    <caption>
      Art Institute of Chicago rows for ${data.label}
    </caption>
    <thead>
      <tr>
        <th>Work</th>
        <th>Maker</th>
        <th>Date</th>
        <th>Medium</th>
      </tr>
    </thead>
    <tbody>
      ${raw(data.rows.map(objectRow).join(""))}
    </tbody>
  </table>
</div>`;

export const artworks = fragment("artworks", {
  loading: tableSkeleton,
  error: tableError,
  render: async (context) =>
    objectTable(await loadArtworks(context.url, { signal: context.signal })),
});

/* ------------------------------------------------------------------ page */

const page = (context) => {
  const active = topicForUrl(context.url);
  const collection = collectionForTopic(active);

  return html`<header class="app-header">
      <p class="eyebrow">Art Institute of Chicago · live stream</p>
      <h1>Collection Control</h1>
    </header>

    <section class="layout-grid" aria-label="Collection workspace">
      <aside class="side-panel side-panel--left">
        <p class="panel-label">Index</p>
        <nav class="topic-list" aria-label="Choose a collection index">
          ${raw(topics.map((topic) => topicLink({ active, topic })).join(""))}
        </nav>
      </aside>

      <section class="data-column" aria-labelledby="panel-title">
        <div class="panel-head">
          <div>
            <p class="eyebrow">${collection.accent}</p>
            <h2 id="panel-title">${collection.label}</h2>
          </div>
          <p>${collection.scope}</p>
        </div>

        ${context.defer(collectionStats, {
          class: "stats-slot",
          "aria-label": "Collection statistics",
        })}
        ${context.defer(artworks, {
          class: "table-slot",
          "aria-label": "Artwork rows",
        })}
      </section>

      <aside class="side-column">
        ${context.defer(featuredObject, {
          class: "featured-slot",
          "aria-label": "Featured work",
        })}
        ${context.defer(provenanceFeed, {
          class: "provenance-slot",
          "aria-label": "Provenance feed",
        })}
      </aside>
    </section>`;
};

export const routes = [
  route("/", {
    meta: ({ url }) => ({
      canonical: `${origin}${url.search}`,
      description:
        "An instant static shell with Art Institute of Chicago fragments streamed out of order on a single connection.",
      title: "Collection Control · Native Fragments Stream",
    }),
    render: page,
    fragments: [collectionStats, featuredObject, artworks, provenanceFeed],
  }),
];
