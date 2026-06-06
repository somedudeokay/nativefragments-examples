import { html, raw } from "@nativefragments/core/server";

const fields = [
  ["Display name", "Avery Stone"],
  ["Handle", "@avery"],
  ["Workspace", "Northstar Labs"],
  ["Region", "Europe / Oslo"],
];

export const profilePanel = () => html`<article class="panel-card" data-panel="profile">
  <header class="panel-header">
    <div>
      <p class="panel-kicker">Profile</p>
      <h2>Identity details</h2>
      <p>
        This panel is rendered by the profile child route. The fields are static
        here so the demo stays dependency-free and server-rendered.
      </p>
    </div>
    <span class="status-pill">Verified</span>
  </header>

  <div class="field-grid">
    ${raw(
      fields
        .map(
          ([label, value]) => html`<label class="field">
            <span>${label}</span>
            <input value="${value}" />
          </label>`,
        )
        .join(""),
    )}
  </div>

  <section class="detail-strip" aria-label="Profile summary">
    <div>
      <strong>4</strong>
      <span>linked apps</span>
    </div>
    <div>
      <strong>18</strong>
      <span>team mentions</span>
    </div>
    <div>
      <strong>99%</strong>
      <span>profile complete</span>
    </div>
  </section>

  <footer class="panel-actions">
    <button type="button" class="secondary-button">Reset</button>
    <button type="button" class="primary-button">Save profile</button>
  </footer>
</article>`;
