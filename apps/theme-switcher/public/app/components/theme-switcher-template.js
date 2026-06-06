const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Tokens surfaced in the live token table, in display order.
const tokenRows = [
  { name: "--app-bg", role: "Canvas" },
  { name: "--app-surface", role: "Surface" },
  { name: "--app-ink", role: "Ink" },
  { name: "--app-muted", role: "Muted ink" },
  { name: "--app-accent", role: "Accent" },
  { name: "--app-accent-2", role: "Accent 2" },
  { name: "--app-warn", role: "Signal" },
];

// Compact palette preview used inside each theme chip.
const chipSwatches = [
  "--app-bg",
  "--app-surface",
  "--app-ink",
  "--app-accent",
  "--app-accent-2",
];

const themeOption = (theme, selectedTheme) => {
  const selected = theme.id === selectedTheme;
  const swatches = chipSwatches
    .map(
      (name) =>
        `<i style="background: ${escapeHtml(theme.tokens[name])}" aria-hidden="true"></i>`,
    )
    .join("");

  return `<button
    class="theme-option"
    type="button"
    role="radio"
    aria-checked="${selected ? "true" : "false"}"
    data-theme-option="${escapeHtml(theme.id)}"
  >
    <span class="option-head">
      <strong>${escapeHtml(theme.label)}</strong>
      <span class="option-scheme">${escapeHtml(theme.colorScheme)}</span>
    </span>
    <small>${escapeHtml(theme.summary)}</small>
    <span class="option-palette" aria-hidden="true">${swatches}</span>
    <span class="option-check" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>
    </span>
  </button>`;
};

const tokenRow = ({ name, role }, theme) => `<tr data-token-row="${escapeHtml(name)}">
  <th scope="row">
    <span class="swatch" style="background: var(${name})" aria-hidden="true"></span>
    <span class="token-meta">
      <code>${name}</code>
      <span class="token-role">${escapeHtml(role)}</span>
    </span>
  </th>
  <td><span class="token-value" data-token-value="${escapeHtml(name)}">${escapeHtml(theme.tokens[name])}</span></td>
</tr>`;

export const themeSwitcherHtml = ({ themes, selectedTheme }) => {
  const active = themes.find((theme) => theme.id === selectedTheme) ?? themes[0];

  return `<section class="switcher" aria-label="Theme playground">
  <aside class="control-panel">
    <div class="panel-heading">
      <p>Token sets</p>
      <h2>Choose a theme</h2>
    </div>

    <div class="theme-options" role="radiogroup" aria-label="Theme">
      ${themes.map((theme) => themeOption(theme, selectedTheme)).join("")}
    </div>

    <p class="control-note">
      Selecting a theme writes <code>data-theme</code> on the document and the
      whole page recolours from one variable set.
    </p>
  </aside>

  <div class="preview-panel">
    <div class="browser-bar" aria-hidden="true">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <code class="browser-url">tokens.nativefragments.org</code>
      <span class="browser-tag" data-current-theme>${escapeHtml(active.id)}</span>
    </div>

    <div class="preview-body">
      <article class="preview-card hero-card">
        <span class="card-kicker">Shadow DOM preview</span>
        <h3>Hydrated, never repainted.</h3>
        <p>
          This card lives inside the component's shadow root and reads the same
          document-level custom properties as the page around it.
        </p>
        <div class="hero-actions">
          <span class="btn btn-solid">Primary</span>
          <span class="btn btn-ghost">Secondary</span>
        </div>
      </article>

      <article class="preview-card contrast-card">
        <span class="metric-label">Contrast</span>
        <strong>AA</strong>
        <p>Ink on surface clears WCAG&nbsp;AA in every token set.</p>
        <div class="contrast-samples" aria-hidden="true">
          <span class="sample sample-ink">Aa</span>
          <span class="sample sample-accent">Aa</span>
        </div>
      </article>

      <article class="preview-card table-card">
        <div class="table-head">
          <span class="card-kicker">Design tokens</span>
          <span class="table-active" data-active-label>${escapeHtml(active.label)}</span>
        </div>
        <table class="token-table">
          <thead>
            <tr><th scope="col">Token</th><th scope="col">Value</th></tr>
          </thead>
          <tbody>
            ${tokenRows.map((row) => tokenRow(row, active)).join("")}
          </tbody>
        </table>
      </article>
    </div>
  </div>
</section>`;
};

export const themeSwitcherStyles = `
  :host {
    display: block;
  }

  * {
    box-sizing: border-box;
  }

  button,
  code,
  table,
  th,
  td {
    font: inherit;
  }

  .switcher {
    /* The 1px grid gap reveals this background as a hairline gutter. */
    background: var(--app-line);
    border: 1px solid var(--app-strong-line);
    box-shadow: var(--app-shadow);
    color: var(--app-ink);
    display: grid;
    gap: 1px;
    grid-template-columns: minmax(248px, 0.78fr) minmax(0, 1.22fr);
    overflow: hidden;
  }

  .control-panel,
  .preview-panel {
    background: var(--app-surface);
    min-width: 0;
  }

  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
    padding: clamp(1.1rem, 2.4vw, 1.6rem);
  }

  .panel-heading p,
  .card-kicker,
  .metric-label {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    margin: 0;
    text-transform: uppercase;
  }

  .panel-heading h2 {
    font-family: ui-serif, "Iowan Old Style", Georgia, "Times New Roman", serif;
    font-size: clamp(1.7rem, 3.4vw, 2.5rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0.4rem 0 0;
  }

  .theme-options {
    display: grid;
    gap: 0.6rem;
  }

  .theme-option {
    background: color-mix(in srgb, var(--app-panel) 50%, var(--app-surface));
    border: 1px solid var(--app-line);
    color: var(--app-ink);
    cursor: pointer;
    display: grid;
    gap: 0.5rem 0.75rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 0.8rem 0.9rem;
    text-align: left;
    transition:
      border-color 160ms ease,
      background 160ms ease;
  }

  .theme-option:hover {
    border-color: var(--app-strong-line);
  }

  .theme-option:focus-visible {
    outline: 3px solid var(--app-accent-2);
    outline-offset: 2px;
  }

  .theme-option[aria-checked="true"] {
    background: color-mix(in srgb, var(--app-accent) 12%, var(--app-surface));
    border-color: var(--app-accent);
  }

  .option-head {
    align-items: baseline;
    display: flex;
    gap: 0.55rem;
    min-width: 0;
  }

  .option-head strong {
    font-size: 0.98rem;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  .option-scheme {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .theme-option small {
    color: var(--app-muted);
    font-size: 0.79rem;
    grid-column: 1 / -1;
    line-height: 1.4;
  }

  .option-palette {
    border: 1px solid var(--app-line);
    display: flex;
    grid-column: 1 / -1;
    height: 1.45rem;
    margin-top: 0.1rem;
    overflow: hidden;
  }

  .option-palette i {
    display: block;
    flex: 1;
  }

  .option-palette i + i {
    border-left: 1px solid color-mix(in srgb, var(--app-ink) 14%, transparent);
  }

  .option-check {
    align-self: start;
    border: 1px solid var(--app-strong-line);
    border-radius: 999px;
    color: var(--app-surface);
    display: grid;
    height: 1.4rem;
    opacity: 0;
    place-items: center;
    transition: opacity 140ms ease;
    width: 1.4rem;
  }

  .theme-option[aria-checked="true"] .option-check {
    background: var(--app-accent);
    border-color: var(--app-accent);
    opacity: 1;
  }

  .control-note {
    color: var(--app-muted);
    font-size: 0.8rem;
    line-height: 1.5;
    margin: auto 0 0;
  }

  .control-note code {
    background: color-mix(in srgb, var(--app-ink) 9%, transparent);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.74rem;
    padding: 0.1rem 0.32rem;
  }

  .preview-panel {
    display: flex;
    flex-direction: column;
  }

  .browser-bar {
    align-items: center;
    background: color-mix(in srgb, var(--app-panel) 60%, var(--app-surface));
    border-bottom: 1px solid var(--app-line);
    display: flex;
    gap: 0.42rem;
    min-height: 2.7rem;
    padding: 0 0.85rem;
  }

  .browser-bar .dot {
    background: var(--app-muted);
    border-radius: 999px;
    height: 0.56rem;
    opacity: 0.5;
    width: 0.56rem;
  }

  .browser-bar .dot:nth-child(2) {
    background: var(--app-warn);
    opacity: 0.8;
  }

  .browser-bar .dot:nth-child(3) {
    background: var(--app-accent);
    opacity: 0.8;
  }

  .browser-url {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.74rem;
    margin-left: 0.45rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .browser-tag {
    background: var(--app-accent);
    color: var(--app-surface);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    margin-left: auto;
    padding: 0.18rem 0.5rem;
  }

  .preview-body {
    background:
      linear-gradient(90deg, var(--app-line) 1px, transparent 1px) 0 0 / 34px 34px,
      linear-gradient(var(--app-line) 1px, transparent 1px) 0 0 / 34px 34px,
      color-mix(in srgb, var(--app-bg) 70%, var(--app-surface));
    display: grid;
    flex: 1;
    gap: 0.9rem;
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    padding: clamp(1rem, 2.6vw, 1.5rem);
  }

  .preview-card {
    background: var(--app-surface);
    border: 1px solid var(--app-line);
    color: var(--app-ink);
    min-width: 0;
    padding: clamp(1rem, 2vw, 1.25rem);
  }

  .hero-card {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .hero-card h3 {
    font-family: ui-serif, "Iowan Old Style", Georgia, "Times New Roman", serif;
    font-size: clamp(1.7rem, 3.4vw, 2.5rem);
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.02;
    margin: 0.15rem 0 0;
  }

  .hero-card p,
  .contrast-card p {
    color: var(--app-muted);
    line-height: 1.55;
    margin: 0;
    max-width: 38ch;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 0.35rem;
  }

  .btn {
    border: 1px solid transparent;
    font-size: 0.83rem;
    font-weight: 650;
    letter-spacing: -0.01em;
    padding: 0.5rem 0.95rem;
  }

  .btn-solid {
    background: var(--app-accent);
    color: var(--app-surface);
  }

  .btn-ghost {
    background: transparent;
    border-color: var(--app-strong-line);
    color: var(--app-ink);
  }

  .contrast-card {
    align-content: start;
    display: grid;
    gap: 0.45rem;
  }

  .contrast-card strong {
    color: var(--app-accent-2);
    font-family: ui-serif, "Iowan Old Style", Georgia, "Times New Roman", serif;
    font-size: clamp(3.4rem, 7vw, 5.4rem);
    font-weight: 600;
    letter-spacing: -0.05em;
    line-height: 0.85;
  }

  .contrast-samples {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.55rem;
  }

  .sample {
    align-items: center;
    border: 1px solid var(--app-line);
    display: flex;
    flex: 1;
    font-family: ui-serif, "Iowan Old Style", Georgia, serif;
    font-size: 1.25rem;
    font-weight: 600;
    justify-content: center;
    padding: 0.6rem 0;
  }

  .sample-ink {
    background: var(--app-surface);
    border-color: var(--app-strong-line);
    color: var(--app-ink);
  }

  .sample-accent {
    background: var(--app-accent);
    color: var(--app-surface);
  }

  .table-card {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    grid-column: 1 / -1;
  }

  .table-head {
    align-items: baseline;
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
  }

  .table-active {
    color: var(--app-muted);
    font-size: 0.8rem;
    font-weight: 600;
  }

  .token-table {
    border-collapse: collapse;
    font-size: 0.82rem;
    width: 100%;
  }

  .token-table thead th {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    padding: 0 0 0.5rem;
    text-align: left;
    text-transform: uppercase;
  }

  .token-table tbody th,
  .token-table tbody td {
    border-top: 1px solid var(--app-line);
    padding: 0.5rem 0;
    vertical-align: middle;
  }

  .token-table tbody th {
    font-weight: 400;
  }

  .token-table tbody th {
    align-items: center;
    display: flex;
    gap: 0.6rem;
  }

  .swatch {
    border: 1px solid var(--app-strong-line);
    flex: none;
    height: 1.15rem;
    width: 1.15rem;
  }

  .token-meta {
    display: grid;
    gap: 0.05rem;
    min-width: 0;
  }

  .token-meta code {
    color: var(--app-ink);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
  }

  .token-role {
    color: var(--app-muted);
    font-size: 0.68rem;
    letter-spacing: 0.02em;
  }

  .token-table td {
    text-align: right;
  }

  .token-value {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 860px) {
    .switcher {
      grid-template-columns: 1fr;
    }

    .preview-body {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-option,
    .option-check {
      transition: none;
    }
  }
`;
