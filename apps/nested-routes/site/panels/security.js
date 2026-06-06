import { html, raw } from "@nativefragments/core/server";

const sessions = [
  ["MacBook Pro", "Oslo, Norway", "Active now"],
  ["iPhone", "Bergen, Norway", "2 hours ago"],
  ["Cloudflare Worker preview", "Frankfurt, Germany", "Yesterday"],
];

export const securityPanel = () => html`<article
  class="panel-card"
  data-panel="security"
>
  <header class="panel-header">
    <div>
      <p class="panel-kicker">Security</p>
      <h2>Passkeys and sessions</h2>
      <p>
        A nested fragment request for this route returns only this security
        panel plus metadata. The sidebar and outer layout remain untouched.
      </p>
    </div>
    <span class="status-pill strong">Hardened</span>
  </header>

  <section class="security-score" aria-label="Security score">
    <div>
      <span>Security score</span>
      <strong>92</strong>
    </div>
    <meter min="0" max="100" value="92">92%</meter>
  </section>

  <section class="rule-list" aria-label="Authentication rules">
    <div>
      <strong>Passkey required</strong>
      <span>Owners and billing admins must use a device-bound passkey.</span>
    </div>
    <div>
      <strong>Recovery reviewed</strong>
      <span>Backup codes were rotated within the last 30 days.</span>
    </div>
    <div>
      <strong>Session alerts</strong>
      <span>New device sign-ins notify admins immediately.</span>
    </div>
  </section>

  <section class="session-list" aria-label="Recent sessions">
    <h3>Recent sessions</h3>
    ${raw(
      sessions
        .map(
          ([device, location, seen]) => html`<div class="session-row">
            <strong>${device}</strong>
            <span>${location}</span>
            <time>${seen}</time>
          </div>`,
        )
        .join(""),
    )}
  </section>
</article>`;
