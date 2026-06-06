import { counterConfig, counterView } from "./counter-model.js";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const signed = (value) => (value > 0 ? `+${value}` : String(value));

// A compact readable feed of recent values, newest first, with the
// signed delta from the previous reading so the reactivity is legible.
export const renderHistoryRows = (view) => {
  const items = view.history;
  return items
    .map((value, index) => {
      const prev = index === 0 ? value : items[index - 1];
      const delta = value - prev;
      const tone = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
      const isLatest = index === items.length - 1;
      const deltaLabel =
        index === 0 ? "init" : delta === 0 ? "0" : signed(delta);
      const deltaTone = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
      return `<li data-tone="${tone}"${isLatest ? ' data-latest="true"' : ""}>
        <span class="row-idx">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
        <span class="row-val">${escapeHtml(signed(value))}</span>
        <span class="row-delta" data-delta="${deltaTone}">${escapeHtml(deltaLabel)}</span>
      </li>`;
    })
    .reverse()
    .join("");
};

export const counterStyles = `
  :host {
    display: block;
  }

  .panel {
    --bg: #14171a;
    --bg-2: #191d21;
    --raise: #20262b;
    --ink: #f3f1ea;
    --muted: #8c948f;
    --faint: #5d6560;
    --line: rgba(243, 241, 234, 0.1);
    --line-strong: rgba(243, 241, 234, 0.2);
    --accent: #e7b53c;
    --green: #4bbf86;
    --red: #e5634d;
    --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    background:
      radial-gradient(120% 80% at 50% -10%, rgba(243, 241, 234, 0.05), transparent 60%),
      var(--bg);
    border: 1px solid #0c0e10;
    border-radius: 4px;
    box-shadow:
      0 1px 0 rgba(243, 241, 234, 0.06) inset,
      0 30px 70px -30px rgba(0, 0, 0, 0.7);
    color: var(--ink);
    display: grid;
    font-family: var(--sans);
    gap: 1px;
    overflow: hidden;
  }

  .panel > * {
    background: var(--bg);
  }

  .label {
    color: var(--faint);
    font-family: var(--mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  /* ---- top rail ---- */
  .rail {
    align-items: center;
    border-bottom: 1px solid var(--line);
    display: flex;
    gap: 0.6rem;
    justify-content: space-between;
    padding: 0.85rem 1.1rem;
  }

  .rail-id {
    align-items: center;
    color: var(--muted);
    display: flex;
    font-family: var(--mono);
    font-size: 0.72rem;
    gap: 0.5rem;
    letter-spacing: 0.04em;
  }

  .dot {
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(231, 181, 60, 0.18);
    height: 7px;
    width: 7px;
  }

  .panel[data-tone="positive"] .dot { background: var(--green); box-shadow: 0 0 0 3px rgba(75, 191, 134, 0.18); }
  .panel[data-tone="negative"] .dot { background: var(--red); box-shadow: 0 0 0 3px rgba(229, 99, 77, 0.18); }

  .status {
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.7rem;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ---- stage: readout + gauge ---- */
  .stage {
    display: grid;
    gap: 1.6rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: clamp(1.4rem, 4vw, 2.4rem) clamp(1.1rem, 4vw, 2rem);
  }

  .readout {
    align-self: center;
    min-width: 0;
  }

  .count {
    color: var(--ink);
    display: block;
    font-family: var(--mono);
    font-size: clamp(4.25rem, 15vw, 8rem);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 0.95;
    overflow: visible;
  }

  .panel[data-tone="positive"] .count { color: #d9f2e5; }
  .panel[data-tone="negative"] .count { color: #f6dcd6; }

  .meta {
    align-items: center;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    font-family: var(--mono);
    font-size: 0.74rem;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .pill {
    border: 1px solid var(--line);
    border-radius: 3px;
    color: var(--muted);
    letter-spacing: 0.04em;
    padding: 0.28rem 0.5rem;
  }

  .pill b {
    color: var(--ink);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  /* ---- gauge ---- */
  .gauge {
    align-items: stretch;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto 1.5rem;
  }

  .ticks {
    color: var(--faint);
    display: flex;
    flex-direction: column;
    font-family: var(--mono);
    font-size: 0.62rem;
    font-variant-numeric: tabular-nums;
    justify-content: space-between;
    text-align: right;
  }

  .meter {
    background: var(--bg-2);
    border: 1px solid var(--line-strong);
    border-radius: 3px;
    display: grid;
    min-height: 9.5rem;
    overflow: hidden;
    position: relative;
  }

  .meter::before {
    background: var(--line);
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 2;
  }

  .meter-fill {
    align-self: end;
    background: linear-gradient(180deg, var(--accent), #c4922a);
    display: block;
    height: var(--progress, 50%);
    transition: height 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
    width: 100%;
  }

  .panel[data-tone="positive"] .meter-fill { background: linear-gradient(180deg, var(--green), #2f9d68); }
  .panel[data-tone="negative"] .meter-fill { background: linear-gradient(180deg, var(--red), #c24532); }

  /* ---- derived rail ---- */
  .derived {
    border-top: 1px solid var(--line);
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .derived .cell {
    background: var(--bg);
    display: grid;
    gap: 0.3rem;
    padding: 0.95rem 1.1rem;
  }

  .cell .label { color: var(--faint); }

  .cell .val {
    color: var(--ink);
    font-family: var(--mono);
    font-size: 1.55rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .cell .val[data-parity] {
    text-transform: capitalize;
  }

  /* ---- controls ---- */
  .controls {
    border-top: 1px solid var(--line);
    display: grid;
    gap: 0.75rem;
    padding: 1.1rem;
  }

  .step-group {
    display: grid;
    gap: 0.5rem;
  }

  .seg {
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow: hidden;
  }

  .seg button {
    background: var(--bg-2);
    border: 0;
    border-right: 1px solid var(--line);
    color: var(--muted);
    cursor: pointer;
    font-family: var(--mono);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    min-height: 2.7rem;
    padding: 0.5rem;
    transition: background-color 140ms ease, color 140ms ease;
  }

  .seg button:last-child { border-right: 0; }
  .seg button:hover { background: var(--raise); color: var(--ink); }
  .seg button[aria-pressed="true"] {
    background: var(--ink);
    color: var(--bg);
    font-weight: 700;
  }

  .pad {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 0.8fr;
  }

  button {
    font-family: var(--mono);
  }

  .key {
    align-items: center;
    background: var(--raise);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    color: var(--ink);
    cursor: pointer;
    display: flex;
    font-size: 0.82rem;
    font-weight: 600;
    gap: 0.4rem;
    justify-content: center;
    letter-spacing: 0.02em;
    min-height: 3.4rem;
    padding: 0.75rem;
    transition: background-color 130ms ease, transform 90ms ease, box-shadow 130ms ease;
  }

  .key svg { display: block; flex: none; }

  .key:hover {
    background: #262d33;
  }

  .key:active {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4) inset;
    transform: translateY(1px);
  }

  .key:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .key:disabled {
    color: var(--faint);
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }

  .key.primary {
    background: var(--accent);
    border-color: transparent;
    color: #1a1408;
    font-weight: 700;
  }

  .panel[data-tone="positive"] .key.primary { background: var(--green); color: #06200f; }
  .panel[data-tone="negative"] .key.primary { background: var(--red); color: #2a0a05; }

  .key.primary:hover { filter: brightness(1.07); background: var(--accent); }
  .panel[data-tone="positive"] .key.primary:hover { background: var(--green); }
  .panel[data-tone="negative"] .key.primary:hover { background: var(--red); }
  .key.primary:disabled { filter: none; }

  .key.ghost {
    background: transparent;
  }
  .key.ghost:hover { background: var(--bg-2); }

  /* ---- history feed ---- */
  .history {
    border-top: 1px solid var(--line);
    padding: 1.1rem;
  }

  .history-head {
    align-items: baseline;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.7rem;
  }

  .history-head .count-tag {
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.68rem;
    font-variant-numeric: tabular-nums;
  }

  .feed {
    display: flex;
    flex-direction: column;
    gap: 1px;
    list-style: none;
    margin: 0;
    max-height: 11rem;
    overflow: auto;
    padding: 0;
  }

  .feed li {
    align-items: center;
    border-left: 2px solid var(--line-strong);
    display: grid;
    gap: 0.75rem;
    grid-template-columns: auto 1fr auto;
    padding: 0.5rem 0.7rem;
  }

  .feed li[data-tone="positive"] { border-left-color: var(--green); }
  .feed li[data-tone="negative"] { border-left-color: var(--red); }
  .feed li[data-tone="neutral"] { border-left-color: var(--faint); }

  .feed li[data-latest="true"] {
    background: var(--bg-2);
  }

  .row-idx {
    color: var(--faint);
    font-family: var(--mono);
    font-size: 0.68rem;
    font-variant-numeric: tabular-nums;
  }

  .row-val {
    color: var(--ink);
    font-family: var(--mono);
    font-size: 0.92rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .row-delta {
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
  }

  .row-delta[data-delta="up"] { color: var(--green); }
  .row-delta[data-delta="down"] { color: var(--red); }

  @media (max-width: 540px) {
    .stage {
      gap: 1.1rem;
      grid-template-columns: 1fr;
    }

    .gauge {
      grid-template-columns: 1fr;
      grid-template-rows: 1.5rem auto;
    }

    .gauge .ticks {
      flex-direction: row;
      text-align: left;
    }

    .meter {
      min-height: 0;
    }

    .meter::before { display: none; }

    .meter-fill {
      align-self: stretch;
      height: 100% !important;
      width: var(--progress, 50%);
      transition: width 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .pad {
      grid-template-columns: 1fr 1fr;
    }

    .pad .key.ghost {
      grid-column: 1 / -1;
    }
  }
`;

const minus = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const plus = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const reset = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M11.5 7a4.5 4.5 0 1 1-1.32-3.18M11.5 1.5V4H9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const renderCounterShadow = (state) => {
  const view = counterView(state);
  const steps = [1, 2, 5];

  return `<section class="panel" data-tone="${view.tone}" aria-label="Signal counter instrument">
    <div class="rail">
      <span class="rail-id"><span class="dot" data-bind="dot" aria-hidden="true"></span>signal.value</span>
      <span class="status" data-bind="status">${escapeHtml(view.status)}</span>
    </div>

    <div class="stage">
      <div class="readout">
        <output
          class="count"
          data-bind="count"
          aria-live="polite"
          aria-atomic="true"
        >${escapeHtml(view.countLabel)}</output>
        <div class="meta">
          <span class="pill">step <b data-bind="step">${escapeHtml(view.stepLabel)}</b></span>
          <span class="pill">range ${view.min} … ${view.max}</span>
        </div>
      </div>
      <div class="gauge">
        <div class="ticks" aria-hidden="true">
          <span>${view.max}</span>
          <span>0</span>
          <span>${view.min}</span>
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
    </div>

    <div class="derived" aria-label="Derived signals">
      <div class="cell">
        <span class="label">doubled</span>
        <span class="val" data-bind="doubled">${escapeHtml(view.doubledLabel)}</span>
      </div>
      <div class="cell">
        <span class="label">parity</span>
        <span class="val" data-parity data-bind="parity">${escapeHtml(view.parity)}</span>
      </div>
      <div class="cell">
        <span class="label">|distance|</span>
        <span class="val" data-bind="distance">${escapeHtml(view.distanceLabel)}</span>
      </div>
    </div>

    <div class="controls">
      <div class="step-group">
        <span class="label">step size</span>
        <div class="seg" role="group" aria-label="Step size">
          ${steps
            .map(
              (value) =>
                `<button type="button" data-step="${value}" aria-pressed="${value === view.step}">${value}</button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="pad">
        <button type="button" class="key" data-action="decrement" aria-label="Decrement by step"${view.canDecrement ? "" : " disabled"}>${minus} step</button>
        <button type="button" class="key primary" data-action="increment" aria-label="Increment by step"${view.canIncrement ? "" : " disabled"}>${plus} step</button>
        <button type="button" class="key ghost" data-action="reset" aria-label="Reset to origin">${reset} reset</button>
      </div>
    </div>

    <div class="history">
      <div class="history-head">
        <span class="label">history</span>
        <span class="count-tag" data-bind="history-count">${view.history.length} of 9</span>
      </div>
      <ol
        class="feed"
        data-bind="history"
        aria-label="Recent counter values: ${escapeHtml(view.historyLabel)}"
      >${renderHistoryRows(view)}</ol>
    </div>
  </section>`;
};
