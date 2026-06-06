import { html, raw, route } from "@nativefragments/core/server";
import {
  feedSummary,
  filterCounts,
  filterEvents,
  filters,
} from "./model.js";

const origin = "https://activity-feed.nativefragments.org";

const filterHref = (filter) => (filter === "all" ? "/" : `/?filter=${filter}`);

const filterLabels = {
  all: "All activity",
  deploys: "Deploys",
  incidents: "Incidents",
  comments: "Comments",
};

const icons = {
  deploys: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 13.5 12 4l7 9.5" /><path d="M9 13.5v6.5h6v-6.5" /><circle cx="12" cy="9" r="1.4" /></svg>`,
  incidents: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4 3 19.5h18Z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.4" r="0.9" /></svg>`,
  comments: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5h16v11H9.5L5 20.5v-4H4Z" /><path d="M8.5 10h7" /><path d="M8.5 13h4.5" /></svg>`,
};

const chip = (filter, active, count) => {
  const isActive = filter === active;
  return html`<a
    class="chip ${isActive ? "chip--active" : ""}"
    href="${filterHref(filter)}"
    data-fragment-prefetch="intent"
    aria-current="${isActive ? "page" : "false"}"
  >
    <span class="chip__label">${filterLabels[filter]}</span>
    <span class="chip__count">${count}</span>
  </a>`;
};

const filterNav = (active, counts) => html`<nav
  class="filters"
  aria-label="Filter activity"
>
  ${raw(filters.map((filter) => chip(filter, active, counts[filter])).join(""))}
</nav>`;

const eventRow = (event) => html`<li class="event event--${event.kind}">
  <span class="event__node" aria-hidden="true">
    <span class="event__icon">${raw(icons[event.kind])}</span>
  </span>
  <article class="event__body">
    <header class="event__head">
      <p class="event__meta">
        <span class="event__actor">${event.actor}</span>
        <span class="event__action">${event.action}</span>
        <span class="event__kind event__kind--${event.kind}">${event.kind.replace(/s$/, "")}</span>
      </p>
      <time class="event__age">${event.age} ago</time>
    </header>
    <h2 class="event__title">${event.title}</h2>
    <p class="event__detail">${event.detail}</p>
  </article>
  <code class="event__id">${event.id}</code>
</li>`;

const eventList = (items) => html`<ol class="feed" role="list">
  ${raw(items.map(eventRow).join(""))}
</ol>`;

const homePage = ({ url }) => {
  const active = url.searchParams.get("filter") || "all";
  const summary = feedSummary(active);
  const items = filterEvents(active);
  const counts = filterCounts();
  const activeLabel = filterLabels[summary.filter];

  return html`<section class="page" aria-labelledby="page-title">
    <header class="masthead">
      <div class="masthead__intro">
        <p class="eyebrow">Activity Feed</p>
        <h1 id="page-title">Operations timeline</h1>
      </div>
      <p class="masthead__lede">
        Filter links render full HTML on first load and swap fragment HTML once
        the router takes over. The event model stays plain JavaScript.
      </p>
    </header>

    <div class="controls">
      ${raw(filterNav(summary.filter, counts))}
      <a class="refresh" href="${filterHref(summary.filter)}" data-fragment-prefetch="none">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 12a7 7 0 1 1-2.1-5" /><path d="M19 4v4h-4" /></svg>
        <span>Refresh</span>
      </a>
    </div>

    <p class="result" aria-live="polite">
      <strong>${summary.total}</strong>
      ${summary.total === 1 ? "event" : "events"} in
      <span class="result__scope">${activeLabel}</span>
      · newest <code class="result__id">${summary.newest ?? "—"}</code>
    </p>

    ${raw(eventList(items))}
  </section>`;
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
