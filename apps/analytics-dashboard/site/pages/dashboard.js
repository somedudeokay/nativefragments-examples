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
  <span>${section.kicker}</span>
  ${section.navLabel}
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
        <p class="eyebrow">Analytics Dashboard Demo</p>
        <h1>Operations-grade analytics without a frontend stack.</h1>
      </div>
      <a
        class="source-link"
        href="https://github.com/somedudeokay/nativefragments"
        data-nativefragments-reload
      >Framework source</a>
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
