import { counterConfig, counterView } from "./counter-model.js";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const barHeight = (value) => {
  const magnitude = Math.abs(Number(value));
  return 18 + Math.round((magnitude / counterConfig.max) * 62);
};

export const renderHistoryBars = (view) =>
  view.history
    .map((value) => {
      const tone = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
      return `<i data-tone="${tone}" style="--bar: ${barHeight(value)}%" title="${escapeHtml(value)}"></i>`;
    })
    .join("");

export const counterStyles = `
  :host {
    display: block;
  }

  .panel {
    --panel-bg: #171714;
    --panel-ink: #fff8ea;
    --panel-muted: #a9a08f;
    --panel-line: rgba(255, 248, 234, 0.14);
    background:
      linear-gradient(rgba(255, 248, 234, 0.05) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(90deg, rgba(255, 248, 234, 0.04) 1px, transparent 1px) 0 0 / 28px 28px,
      var(--panel-bg);
    border: 1px solid rgba(23, 23, 20, 0.78);
    box-shadow:
      0 34px 80px rgba(23, 23, 20, 0.32),
      inset 0 1px 0 rgba(255, 248, 234, 0.08);
    color: var(--panel-ink);
    min-height: 520px;
    overflow: hidden;
    padding: clamp(1rem, 3vw, 1.5rem);
    position: relative;
  }

  .panel::after {
    background:
      radial-gradient(circle, rgba(255, 248, 234, 0.72) 0 1px, transparent 1.5px) 0 0 / 18px 18px;
    content: "";
    inset: 0;
    opacity: 0.08;
    pointer-events: none;
    position: absolute;
  }

  .topline,
  .readout,
  .controls,
  .history {
    position: relative;
    z-index: 1;
  }

  .topline {
    align-items: center;
    border-bottom: 1px solid var(--panel-line);
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    padding-bottom: 1rem;
  }

  .label {
    color: var(--panel-muted);
    font-family: "SFMono-Regular", "Cascadia Code", Consolas, ui-monospace, monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .status {
    border: 1px solid var(--panel-line);
    border-radius: 999px;
    color: var(--panel-muted);
    font-size: 0.78rem;
    padding: 0.32rem 0.62rem;
    white-space: nowrap;
  }

  .readout {
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: clamp(2rem, 5vw, 3rem) 0;
  }

  .count {
    font-family: Charter, "Bitstream Charter", "Sitka Text", Georgia, serif;
    font-size: clamp(5.6rem, 14vw, 10rem);
    font-weight: 700;
    line-height: 0.78;
  }

  .meter {
    align-self: stretch;
    background: rgba(255, 248, 234, 0.08);
    border: 1px solid var(--panel-line);
    display: grid;
    min-height: 220px;
    padding: 0.42rem;
    width: 1.35rem;
  }

  .meter-fill {
    align-self: end;
    background: #e8b44f;
    display: block;
    height: var(--progress);
    min-height: 6px;
    transition: height 180ms ease, background-color 180ms ease;
  }

  .panel[data-tone="positive"] .meter-fill,
  .panel[data-tone="positive"] .primary {
    background: #2ca36f;
  }

  .panel[data-tone="negative"] .meter-fill,
  .panel[data-tone="negative"] .primary {
    background: #d24a3d;
  }

  .meta {
    color: var(--panel-muted);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.9rem;
    gap: 0.55rem;
    margin-top: 0.85rem;
  }

  .pill {
    border: 1px solid var(--panel-line);
    padding: 0.34rem 0.5rem;
  }

  .controls {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  button {
    background: rgba(255, 248, 234, 0.08);
    border: 1px solid var(--panel-line);
    color: var(--panel-ink);
    cursor: pointer;
    min-height: 4rem;
    padding: 0.85rem;
    transition: background-color 160ms ease, transform 160ms ease;
  }

  button:hover {
    background: rgba(255, 248, 234, 0.14);
    transform: translateY(-1px);
  }

  button:focus-visible {
    outline: 3px solid #f2c66d;
    outline-offset: 3px;
  }

  button:disabled {
    color: rgba(255, 248, 234, 0.32);
    cursor: not-allowed;
    transform: none;
  }

  .primary {
    color: #10100d;
    font-weight: 800;
  }

  .history {
    border-top: 1px solid var(--panel-line);
    display: grid;
    gap: 0.85rem;
    grid-template-columns: auto minmax(0, 1fr);
    margin-top: 1.2rem;
    padding-top: 1.2rem;
  }

  .bars {
    align-items: end;
    display: flex;
    gap: 0.32rem;
    height: 5rem;
    justify-content: flex-end;
    min-width: 0;
  }

  .bars i {
    background: #e8b44f;
    display: block;
    flex: 0 1 1.1rem;
    height: var(--bar);
    min-height: 0.5rem;
    opacity: 0.85;
    transition: height 180ms ease, background-color 180ms ease;
  }

  .bars i[data-tone="positive"] {
    background: #2ca36f;
  }

  .bars i[data-tone="negative"] {
    background: #d24a3d;
  }

  @media (max-width: 520px) {
    .panel {
      min-height: 0;
    }

    .readout {
      grid-template-columns: 1fr;
    }

    .meter {
      min-height: 1rem;
      width: auto;
    }

    .meter-fill {
      height: 100%;
      width: var(--progress);
    }

    .controls {
      grid-template-columns: 1fr;
    }
  }
`;

export const renderCounterShadow = (state) => {
  const view = counterView(state);

  return `<section class="panel" data-tone="${view.tone}" aria-label="Signal counter">
    <div class="topline">
      <span class="label">signal.value</span>
      <span class="status" data-bind="status">${escapeHtml(view.status)}</span>
    </div>

    <div class="readout">
      <div>
        <output
          class="count"
          data-bind="count"
          aria-live="polite"
          aria-atomic="true"
        >${escapeHtml(view.countLabel)}</output>
        <div class="meta">
          <span class="pill">step <b data-bind="step">${escapeHtml(view.stepLabel)}</b></span>
          <span class="pill">range ${view.min}..${view.max}</span>
        </div>
      </div>
      <div
        class="meter"
        role="meter"
        aria-label="Counter position"
        aria-valuemin="${view.min}"
        aria-valuemax="${view.max}"
        aria-valuenow="${escapeHtml(state.count)}"
      >
        <span class="meter-fill" data-bind="meter" style="--progress: ${view.progress}%"></span>
      </div>
    </div>

    <div class="controls">
      <button type="button" data-action="decrement"${view.canDecrement ? "" : " disabled"}>
        - step
      </button>
      <button type="button" class="primary" data-action="increment"${view.canIncrement ? "" : " disabled"}>
        + step
      </button>
      <button type="button" data-action="reset">reset</button>
      <button type="button" data-step="1">step 1</button>
      <button type="button" data-step="2">step 2</button>
      <button type="button" data-step="5">step 5</button>
    </div>

    <div class="history">
      <span class="label">history</span>
      <div
        class="bars"
        data-bind="history"
        aria-label="Recent counter values: ${escapeHtml(view.historyLabel)}"
      >${renderHistoryBars(view)}</div>
    </div>
  </section>`;
};
