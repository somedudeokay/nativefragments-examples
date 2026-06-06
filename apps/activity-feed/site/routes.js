import { html, route } from "@nativefragments/core/server";
import { feedSummary, filterEvents, filters } from "./model.js";

const origin = "https://activity-feed.nativefragments.org";

const filterHref = (filter) => (filter === "all" ? "/" : `/?filter=${filter}`);

const filterNav = (active) => html`<nav class="filters" aria-label="Feed filters">
  ${filters.map(
    (filter) => html`<a
      class="${filter === active ? "active" : ""}"
      href="${filterHref(filter)}"
      data-fragment-prefetch="intent"
    >${filter}</a>`,
  )}
</nav>`;

const eventList = (items) => html`<ol class="feed">
  ${items.map(
    (event) => html`<li>
      <span class="dot ${event.kind}"></span>
      <div>
        <p>${event.kind} · ${event.age}</p>
        <h2>${event.title}</h2>
        <span>${event.detail}</span>
      </div>
      <code>${event.id}</code>
    </li>`,
  )}
</ol>`;

const homePage = ({ url }) => {
  const active = url.searchParams.get("filter") || "all";
  const summary = feedSummary(active);
  const items = filterEvents(active);

  return html`<section class="hero">
    <div>
      <p class="eyebrow">Activity Feed</p>
      <h1>Server-rendered operations timeline.</h1>
    </div>
    <p>
      Filter links render full HTML on first load and fragment HTML after the
      router takes over. The data model stays plain JavaScript.
    </p>
  </section>

  <section class="toolbar">
    ${filterNav(summary.filter)}
    <a href="${filterHref(summary.filter)}" data-fragment-prefetch="none">Refresh feed</a>
  </section>

  <section class="summary">
    <article><strong>${summary.total}</strong><span>Visible events</span></article>
    <article><strong>${summary.newest}</strong><span>Newest marker</span></article>
  </section>

  ${eventList(items)}`;
};

export const routes = [
  route("/", {
    meta: ({ url }) => ({
      canonical: `${origin}${url.search}`,
      description:
        "A Native Fragments activity feed demo with server-rendered filters and fragment refreshes.",
      title: "Activity Feed · Native Fragments Demo",
    }),
    render: homePage,
  }),
];
