import {
  declarativeShadow,
  fragment,
  html,
  raw,
} from "@nativefragments/core/server";
import {
  SECTIONS,
  analyticsBoardStyles,
  renderAnalyticsBoard,
  resolveDashboardState,
  sectionForPath,
} from "../../public/app/components/analytics-board-template.js";

const navLink = ({ section, active }) => html`<a
  class="section-link"
  href="${section.path}"
  data-section-nav
  ${raw(active ? 'aria-current="page"' : "")}
  ${dashboardFragment.prefetchAttrs("intent")}
>
  <span aria-hidden="true">${section.kicker}</span>
  <span class="section-name">${section.navLabel}</span>
</a>`;

const dashboardPanel = ({ section }) => {
  const state = resolveDashboardState({
    range: "30d",
    section: section.id,
    segment: "all",
  });

  return html`<analytics-board
    data-range="${state.range.id}"
    data-section="${state.section.id}"
    data-segment="${state.segment.id}"
  >${declarativeShadow({
    styles: [analyticsBoardStyles],
    html: renderAnalyticsBoard(state),
  })}</analytics-board>`;
};

export const dashboardFragment = fragment("dashboard-panel", ({ url }) =>
  dashboardPanel({ section: sectionForPath(url.pathname) }),
);

export { sectionForPath };

export const dashboardPage = ({ section }) => html`<main class="app-shell">
  <aside class="sidebar" aria-label="Dashboard sections">
    <a class="brand" href="/" ${dashboardFragment.prefetchAttrs("load")}>
      <span class="brand-mark" aria-hidden="true"></span>
      <span>
        Native Metrics
        <small>Zero dependency console</small>
      </span>
    </a>

    <p class="nav-label">Sections</p>
    <nav class="section-nav" aria-label="Sections">
      ${raw(
        SECTIONS.map((item) =>
          navLink({ active: item.id === section.id, section: item }),
        ).join(""),
      )}
    </nav>

    <div class="sidebar-note">
      <strong>Worker rendered</strong>
      <span>Route fragments keep this shell mounted while each board swaps.</span>
    </div>
  </aside>

  <section class="workspace">
    <header class="workspace-top">
      <div>
        <p class="eyebrow">Native Fragments · Analytics</p>
        <h1>Operations-grade analytics, no frontend stack.</h1>
      </div>
      <a
        class="source-link"
        href="https://github.com/somedudeokay/nativefragments"
        data-nativefragments-reload
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
        <span>Source</span>
      </a>
    </header>

    <section
      id="dashboard-panel"
      class="dashboard-panel"
      ${dashboardFragment.attrs()}
    >
      ${raw(dashboardPanel({ section }))}
    </section>
  </section>
</main>`;
