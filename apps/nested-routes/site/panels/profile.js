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
    <span class="status-pill verified">
      <svg
        class="pill-icon"
        viewBox="0 0 16 16"
        width="13"
        height="13"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.78 6.1-4.3 4.3a.75.75 0 0 1-1.06 0L4.22 8.2a.75.75 0 0 1 1.06-1.06l1.67 1.67 3.77-3.77a.75.75 0 1 1 1.06 1.06Z"
        />
      </svg>
      Verified
    </span>
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
