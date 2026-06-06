import { attrs, html, raw } from "@nativefragments/core/server";

const channels = [
  ["Product updates", "Weekly digest", true],
  ["Security events", "Immediate email", true],
  ["Usage warnings", "In-app and email", true],
  ["Research notes", "Monthly digest", false],
];

export const notificationsPanel = () => html`<article
  class="panel-card"
  data-panel="notifications"
>
  <header class="panel-header">
    <div>
      <p class="panel-kicker">Notifications</p>
      <h2>Delivery preferences</h2>
      <p>
        This panel uses ordinary form controls. No client framework is required
        for the route transition or the accessible fallback page.
      </p>
    </div>
    <span class="status-pill">Digest on</span>
  </header>

  <section class="notification-layout">
    <div class="digest-summary">
      <strong>Thursday</strong>
      <span>Workspace digest</span>
      <p>Rollups are batched after 16:00 local time unless a rule is urgent.</p>
    </div>

    <div class="channel-list" aria-label="Notification channels">
      ${raw(
        channels
          .map(
            ([label, hint, enabled]) => html`<label class="channel-row">
              <span>
                <strong>${label}</strong>
                <small>${hint}</small>
              </span>
              <input type="checkbox"${attrs({ checked: enabled })} />
            </label>`,
          )
          .join(""),
      )}
    </div>
  </section>

  <footer class="panel-actions">
    <button type="button" class="secondary-button">Mute all</button>
    <button type="button" class="primary-button">Update rules</button>
  </footer>
</article>`;
