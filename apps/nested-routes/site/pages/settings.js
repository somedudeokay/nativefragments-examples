import { html, raw } from "@nativefragments/core/server";
import { panelMeta, panels, renderPanel } from "../panels/index.js";

const navLink = ({ activePanel, panel, settingsPanel }) => {
  const isActive = activePanel === panel.id;

  return html`<a
    href="${panel.path}"
    ${settingsPanel.prefetchAttrs(panel.prefetch, {
      "aria-current": isActive ? "page" : null,
      class: `settings-nav-link${isActive ? " is-active" : ""}`,
      "data-settings-link": panel.id,
    })}
  >
    <span class="nav-icon" aria-hidden="true">${panel.icon}</span>
    <span>
      <strong>${panel.navLabel}</strong>
      <small>${panel.navHint}</small>
    </span>
  </a>`;
};

export const settingsPage = ({ activePanel, settingsPanel }) => {
  const active = panelMeta(activePanel);

  return html`<section class="app-shell" aria-labelledby="settings-title">
    <aside class="settings-sidebar" aria-label="Workspace navigation">
      <div class="brand-lockup">
        <span class="brand-mark" aria-hidden="true">NF</span>
        <div>
          <p>Native Fragments</p>
          <strong>Workspace Settings</strong>
        </div>
      </div>

      <nav class="settings-nav" data-settings-nav>
        ${raw(
          panels
            .map((panel) => navLink({ activePanel, panel, settingsPanel }))
            .join(""),
        )}
      </nav>

      <div class="sidebar-note">
        <strong>Nested route slot</strong>
        <p>
          Each sidebar link is a real URL. Enhanced navigation fetches only the
          child panel through the shared <code>settings-panel</code> fragment.
        </p>
      </div>
    </aside>

    <section class="settings-workspace">
      <header class="workspace-header">
        <div>
          <p class="workspace-kicker">Nested routes demo</p>
          <h1 id="settings-title">Settings with fragment panels</h1>
          <p>
            The parent layout stays in place while child routes update the
            panel below. Full page requests still render the complete fallback.
          </p>
        </div>
        <div class="current-route" aria-label="Current panel">
          <span>Route</span>
          <strong data-current-panel-label>${active.title}</strong>
        </div>
      </header>

      <section
        id="settings-panel"
        ${settingsPanel.attrs({
          "aria-label": `${active.title} settings panel`,
          "aria-live": "polite",
          class: "settings-panel",
        })}
      >
        ${raw(renderPanel(activePanel))}
      </section>
    </section>
  </section>`;
};
