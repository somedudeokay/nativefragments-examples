const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const tokenSwatches = [
  "--app-bg",
  "--app-surface",
  "--app-ink",
  "--app-accent",
  "--app-accent-2",
  "--app-warn",
];

const themeOption = (theme, selectedTheme) => {
  const selected = theme.id === selectedTheme;
  const swatchStyle = [
    `--swatch-bg: ${theme.tokens["--app-bg"]}`,
    `--swatch-surface: ${theme.tokens["--app-surface"]}`,
    `--swatch-ink: ${theme.tokens["--app-ink"]}`,
    `--swatch-accent: ${theme.tokens["--app-accent"]}`,
    `--swatch-accent-2: ${theme.tokens["--app-accent-2"]}`,
  ].join("; ");

  return `<button
    class="theme-option"
    type="button"
    role="radio"
    aria-checked="${selected ? "true" : "false"}"
    data-theme-option="${escapeHtml(theme.id)}"
  >
    <span class="option-swatch" style="${escapeHtml(swatchStyle)}" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <span class="option-copy">
      <strong>${escapeHtml(theme.label)}</strong>
      <small>${escapeHtml(theme.summary)}</small>
    </span>
  </button>`;
};

const tokenRow = (name) => `<li>
  <span class="token-dot" style="background: var(${name})"></span>
  <code>${name}</code>
  <span class="token-value">var(${name})</span>
</li>`;

export const themeSwitcherHtml = ({ themes, selectedTheme }) => `<section
  class="switcher"
  aria-label="Persisted theme controls"
>
  <div class="control-panel">
    <div class="panel-heading">
      <p>Persisted controls</p>
      <h2>Theme tokens</h2>
    </div>

    <div class="theme-options" role="radiogroup" aria-label="Theme">
      ${themes.map((theme) => themeOption(theme, selectedTheme)).join("")}
    </div>
  </div>

  <div class="preview-panel">
    <div class="browser-bar" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <code>theme-switcher.nativefragments.org</code>
    </div>

    <div class="preview-grid">
      <article class="preview-card command-card">
        <span class="card-kicker">Shadow DOM preview</span>
        <h3>Hydrated without repainting the shell.</h3>
        <p>
          This card lives inside the component shadow root and still reads
          document-level custom properties.
        </p>
        <div class="command-row">
          <code>data-theme</code>
          <output data-current-theme>${escapeHtml(selectedTheme)}</output>
        </div>
      </article>

      <article class="preview-card metric-card">
        <span class="metric-label">Contrast pass</span>
        <strong>AA</strong>
        <p>Surface, line, ink, focus, and accent colors all come from root vars.</p>
      </article>

      <article class="preview-card token-card">
        <span class="card-kicker">Shared custom properties</span>
        <ul>
          ${tokenSwatches.map(tokenRow).join("")}
        </ul>
      </article>
    </div>
  </div>
</section>`;

export const themeSwitcherStyles = `
  :host {
    display: block;
  }

  * {
    box-sizing: border-box;
  }

  button,
  code,
  output {
    font: inherit;
  }

  .switcher {
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 11%, transparent), transparent 32%),
      linear-gradient(315deg, color-mix(in srgb, var(--app-accent-2) 13%, transparent), transparent 36%),
      var(--app-surface);
    border: 1px solid var(--app-strong-line);
    box-shadow: var(--app-shadow);
    color: var(--app-ink);
    display: grid;
    gap: clamp(1rem, 2vw, 1.4rem);
    grid-template-columns: minmax(230px, 0.72fr) minmax(0, 1.28fr);
    min-height: 520px;
    padding: clamp(0.85rem, 2.2vw, 1.25rem);
  }

  .control-panel,
  .preview-panel {
    border: 1px solid var(--app-line);
    min-width: 0;
  }

  .control-panel {
    background: color-mix(in srgb, var(--app-panel) 72%, transparent);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: clamp(1rem, 2vw, 1.25rem);
  }

  .panel-heading p,
  .card-kicker,
  .metric-label {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0;
    text-transform: uppercase;
  }

  .panel-heading h2,
  .preview-card h3 {
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: -0.02em;
    line-height: 0.98;
    margin: 0.25rem 0 0;
  }

  .panel-heading h2 {
    font-size: clamp(1.9rem, 4vw, 3.4rem);
  }

  .theme-options {
    display: grid;
    gap: 0.65rem;
  }

  .theme-option {
    align-items: center;
    background: color-mix(in srgb, var(--app-surface) 62%, transparent);
    border: 1px solid var(--app-line);
    color: var(--app-ink);
    cursor: pointer;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: 3.2rem minmax(0, 1fr);
    min-height: 4.6rem;
    padding: 0.68rem;
    text-align: left;
    transition:
      background 180ms ease,
      border-color 180ms ease,
      transform 180ms ease;
  }

  .theme-option:hover {
    border-color: var(--app-strong-line);
    transform: translateY(-1px);
  }

  .theme-option:focus-visible {
    outline: 3px solid var(--app-accent-2);
    outline-offset: 3px;
  }

  .theme-option[aria-checked="true"] {
    background: color-mix(in srgb, var(--app-accent) 14%, var(--app-surface));
    border-color: var(--app-accent);
  }

  .option-swatch {
    background: var(--swatch-bg);
    border: 1px solid color-mix(in srgb, var(--swatch-ink) 28%, transparent);
    display: grid;
    gap: 0.22rem;
    height: 3.2rem;
    padding: 0.38rem;
  }

  .option-swatch span:nth-child(1) {
    background: var(--swatch-ink);
  }

  .option-swatch span:nth-child(2) {
    background: var(--swatch-accent);
    width: 72%;
  }

  .option-swatch span:nth-child(3) {
    background: var(--swatch-accent-2);
    width: 46%;
  }

  .option-copy {
    display: grid;
    gap: 0.18rem;
    min-width: 0;
  }

  .option-copy strong {
    font-size: 0.95rem;
    line-height: 1.1;
  }

  .option-copy small {
    color: var(--app-muted);
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .preview-panel {
    background:
      linear-gradient(90deg, var(--app-line) 1px, transparent 1px),
      linear-gradient(var(--app-line) 1px, transparent 1px),
      color-mix(in srgb, var(--app-bg) 82%, var(--app-surface));
    background-size: 38px 38px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .browser-bar {
    align-items: center;
    background: color-mix(in srgb, var(--app-surface) 82%, transparent);
    border-bottom: 1px solid var(--app-line);
    display: flex;
    gap: 0.42rem;
    min-height: 2.6rem;
    padding: 0 0.8rem;
  }

  .browser-bar span {
    background: var(--app-muted);
    border-radius: 999px;
    height: 0.58rem;
    opacity: 0.62;
    width: 0.58rem;
  }

  .browser-bar span:nth-child(2) {
    background: var(--app-warn);
  }

  .browser-bar span:nth-child(3) {
    background: var(--app-accent);
  }

  .browser-bar code {
    color: var(--app-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.74rem;
    margin-left: 0.35rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preview-grid {
    display: grid;
    flex: 1;
    gap: 1rem;
    grid-template-columns: 1fr 0.74fr;
    grid-template-rows: minmax(0, 1fr) auto;
    padding: clamp(1rem, 3vw, 1.6rem);
  }

  .preview-card {
    background: color-mix(in srgb, var(--app-surface) 88%, transparent);
    border: 1px solid var(--app-line);
    color: var(--app-ink);
    min-width: 0;
    padding: clamp(1rem, 2vw, 1.2rem);
  }

  .command-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
  }

  .command-card h3 {
    font-size: clamp(2rem, 5vw, 4.6rem);
    max-width: 9ch;
  }

  .command-card p,
  .metric-card p {
    color: var(--app-muted);
    line-height: 1.5;
    margin: 0;
    max-width: 34ch;
  }

  .command-row {
    align-items: center;
    border-top: 1px solid var(--app-line);
    display: flex;
    gap: 0.6rem;
    justify-content: space-between;
    padding-top: 1rem;
  }

  .command-row code,
  .command-row output,
  .token-card code,
  .token-value {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
  }

  .command-row output {
    background: var(--app-accent);
    color: var(--app-surface);
    font-weight: 800;
    padding: 0.32rem 0.5rem;
  }

  .metric-card {
    align-content: start;
    display: grid;
    gap: 0.8rem;
  }

  .metric-card strong {
    color: var(--app-accent-2);
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(4rem, 9vw, 8rem);
    letter-spacing: -0.06em;
    line-height: 0.82;
  }

  .token-card {
    grid-column: 1 / -1;
  }

  .token-card ul {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
  }

  .token-card li {
    align-items: center;
    border-top: 1px solid var(--app-line);
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    min-width: 0;
    padding-top: 0.55rem;
  }

  .token-dot {
    border: 1px solid var(--app-strong-line);
    display: inline-block;
    height: 1rem;
    width: 1rem;
  }

  .token-card code,
  .token-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .token-value {
    color: var(--app-muted);
  }

  @media (max-width: 820px) {
    .switcher,
    .preview-grid {
      grid-template-columns: 1fr;
    }

    .switcher {
      min-height: auto;
    }

    .command-card h3 {
      max-width: 11ch;
    }

    .token-card ul {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-option {
      transition: none;
    }
  }
`;
