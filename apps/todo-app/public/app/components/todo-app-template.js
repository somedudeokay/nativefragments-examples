import {
  countTasks,
  normalizeFilter,
  normalizeState,
  pathForFilter,
  visibleTasks,
} from "../model/todo-state.js";

export const todoAppStyles = `
  :host {
    --paper: #faf4e4;
    --paper-card: #fffdf6;
    --paper-deep: #efe6d1;
    --ink: #16150f;
    --ink-2: #4a463a;
    --ink-3: #756f5e;
    --hair: rgba(22, 21, 15, 0.16);
    --hair-soft: rgba(22, 21, 15, 0.1);
    --accent: #1f8a4c;
    --accent-soft: #8fe1a2;
    --cream: #f8f1df;
    --cream-2: rgba(248, 241, 223, 0.62);
    --cream-3: rgba(248, 241, 223, 0.42);
    display: block;
    color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  a,
  button,
  input {
    font: inherit;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  .serif {
    font-family: ui-serif, "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  }

  .mono,
  .eyebrow,
  .stat-key,
  .stamp,
  .stamp-key,
  .tab,
  .index,
  .task time,
  .clear,
  .composer label,
  .meta-line {
    font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
  }

  .workspace {
    background: var(--paper-card);
    border: 1.5px solid var(--ink);
    box-shadow: 12px 12px 0 var(--ink);
    display: grid;
    grid-template-columns: minmax(248px, 0.78fr) minmax(0, 1.3fr);
    overflow: hidden;
  }

  /* ---------- Ledger panel ---------- */

  .ledger {
    background:
      radial-gradient(120% 60% at 0% 0%, rgba(143, 225, 162, 0.08), transparent 55%),
      #16150f;
    color: var(--cream);
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-width: 0;
    padding: 34px 30px;
  }

  .brand {
    display: grid;
    gap: 16px;
  }

  .eyebrow {
    align-items: center;
    color: var(--accent-soft);
    display: inline-flex;
    font-size: 0.66rem;
    font-weight: 600;
    gap: 8px;
    letter-spacing: 0.16em;
    margin: 0;
    text-transform: uppercase;
  }

  .eyebrow::before {
    background: var(--accent-soft);
    border-radius: 50%;
    content: "";
    height: 7px;
    width: 7px;
  }

  h1 {
    font-size: clamp(2.2rem, 2.4vw + 1rem, 2.7rem);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 0.98;
    margin: 0;
    max-width: 11ch;
  }

  h1 em {
    color: var(--accent-soft);
    font-style: italic;
  }

  .lede {
    color: var(--cream-2);
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    max-width: 32ch;
  }

  /* ---------- Stats ledger table ---------- */

  .stats {
    border-top: 1px solid var(--cream-3);
    display: grid;
    margin-top: 2px;
  }

  .stat {
    align-items: baseline;
    border-bottom: 1px solid var(--cream-3);
    column-gap: 14px;
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 16px 2px 14px;
    position: relative;
  }

  .stat-key {
    color: var(--cream-2);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .stat-num {
    color: var(--cream);
    font-feature-settings: "tnum" 1;
    font-size: 2.4rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    grid-row: span 2;
    justify-self: end;
    line-height: 0.8;
  }

  .stat-bar {
    background: var(--cream-3);
    grid-column: 1;
    height: 3px;
    overflow: hidden;
    width: 100%;
  }

  .stat-bar i {
    background: var(--accent-soft);
    display: block;
    height: 100%;
    transition: width 0.25s ease;
  }

  .stat[data-key="active"] .stat-num {
    color: var(--accent-soft);
  }

  .stamp {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    margin-top: auto;
  }

  .stamp-key {
    color: var(--cream-3);
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .stamp-val {
    color: var(--accent-soft);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* ---------- Board ---------- */

  .board {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
    padding: 34px 32px;
  }

  .composer {
    display: grid;
    gap: 10px;
  }

  .composer label {
    color: var(--ink-2);
    font-size: 0.64rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .input-row {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  input[name="title"] {
    background: var(--paper);
    border: 1.5px solid var(--ink);
    color: var(--ink);
    min-height: 50px;
    min-width: 0;
    outline: none;
    padding: 0 16px;
  }

  input[name="title"]::placeholder {
    color: var(--ink-3);
  }

  input[name="title"]:focus {
    box-shadow: 4px 4px 0 var(--accent-soft);
  }

  .add {
    align-items: center;
    background: var(--ink);
    border: 1.5px solid var(--ink);
    color: var(--cream);
    cursor: pointer;
    display: inline-flex;
    font-weight: 600;
    gap: 8px;
    justify-content: center;
    letter-spacing: 0.01em;
    min-height: 50px;
    padding: 0 22px;
    transition: box-shadow 0.12s ease, transform 0.12s ease;
  }

  .add svg {
    height: 15px;
    width: 15px;
  }

  .add:hover {
    box-shadow: 4px 4px 0 var(--accent-soft);
    transform: translate(-2px, -2px);
  }

  .add:active {
    box-shadow: 1px 1px 0 var(--accent-soft);
    transform: translate(0, 0);
  }

  .form-note {
    align-items: center;
    color: var(--ink-3);
    display: flex;
    font-size: 0.82rem;
    gap: 7px;
    margin: 0;
    min-height: 1.3em;
  }

  .form-note::before {
    background: var(--accent);
    border-radius: 50%;
    content: "";
    flex: none;
    height: 6px;
    width: 6px;
  }

  /* ---------- Toolbar / tabs ---------- */

  .toolbar {
    align-items: center;
    border-top: 1px solid var(--hair);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
    padding-top: 18px;
  }

  .tabs {
    display: inline-flex;
    gap: 2px;
  }

  .tab {
    align-items: center;
    border: 1.5px solid var(--ink);
    color: var(--ink-2);
    display: inline-flex;
    font-size: 0.7rem;
    font-weight: 600;
    gap: 8px;
    letter-spacing: 0.06em;
    margin-left: -1.5px;
    min-height: 38px;
    padding: 0 14px;
    text-decoration: none;
    text-transform: uppercase;
    transition: background 0.12s ease, color 0.12s ease;
  }

  .tab:first-child {
    margin-left: 0;
  }

  .tab:hover {
    background: var(--paper-deep);
    color: var(--ink);
  }

  .tab b {
    color: var(--ink-3);
    font-feature-settings: "tnum" 1;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .tab[aria-current="page"] {
    background: var(--ink);
    color: var(--cream);
    position: relative;
    z-index: 1;
  }

  .tab[aria-current="page"] b {
    color: var(--accent-soft);
  }

  .clear {
    background: transparent;
    border: 1.5px solid transparent;
    color: var(--ink-2);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    min-height: 38px;
    padding: 0 10px;
    text-transform: uppercase;
    transition: color 0.12s ease, border-color 0.12s ease;
  }

  .clear svg {
    height: 13px;
    width: 13px;
  }

  .clear:hover:not(:disabled) {
    border-color: var(--ink);
    color: var(--ink);
  }

  .clear:disabled {
    cursor: not-allowed;
    opacity: 0.34;
  }

  /* ---------- Task list ---------- */

  .tasks {
    border-top: 1px solid var(--hair);
    display: grid;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .task {
    align-items: center;
    border-bottom: 1px solid var(--hair-soft);
    column-gap: 14px;
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) auto;
    padding: 16px 4px;
    position: relative;
    transition: background 0.12s ease;
  }

  .task:hover {
    background: var(--paper);
  }

  .index {
    color: var(--ink-3);
    font-feature-settings: "tnum" 1;
    font-size: 0.74rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    width: 1.6em;
  }

  .task[data-completed="true"] .index {
    color: var(--accent);
  }

  .check {
    display: grid;
    height: 26px;
    place-items: center;
    position: relative;
    width: 26px;
  }

  .check input {
    cursor: pointer;
    height: 26px;
    inset: 0;
    margin: 0;
    opacity: 0;
    position: absolute;
    width: 26px;
    z-index: 2;
  }

  .check-mark {
    align-items: center;
    background: var(--paper-card);
    border: 1.5px solid var(--ink);
    display: flex;
    height: 24px;
    justify-content: center;
    transition: background 0.12s ease, box-shadow 0.12s ease;
    width: 24px;
  }

  .check input:hover + .check-mark {
    box-shadow: 2px 2px 0 var(--accent-soft);
  }

  .check input:focus-visible + .check-mark {
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .check input:checked + .check-mark {
    background: var(--accent);
    border-color: var(--accent);
  }

  .check-mark svg {
    height: 14px;
    opacity: 0;
    width: 14px;
  }

  .check input:checked + .check-mark svg {
    opacity: 1;
  }

  .task-body {
    min-width: 0;
  }

  .task-title {
    color: var(--ink);
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.005em;
    line-height: 1.3;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .task[data-completed="true"] .task-title {
    color: var(--ink-3);
    text-decoration: line-through;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 1.5px;
  }

  .task time {
    color: var(--ink-3);
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    margin-top: 5px;
  }

  .remove {
    align-items: center;
    background: transparent;
    border: 1.5px solid transparent;
    color: var(--ink-3);
    cursor: pointer;
    display: inline-flex;
    height: 32px;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    width: 32px;
  }

  .remove svg {
    height: 15px;
    width: 15px;
  }

  .remove:hover,
  .remove:focus-visible {
    border-color: var(--ink);
    color: var(--ink);
  }

  .task:hover .remove,
  .task:focus-within .remove,
  .remove:focus-visible {
    opacity: 1;
  }

  /* ---------- Empty state ---------- */

  .empty {
    align-items: center;
    border-bottom: 1px solid var(--hair-soft);
    color: var(--ink-3);
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 48px 24px;
    text-align: center;
  }

  .empty svg {
    color: var(--ink);
    height: 34px;
    opacity: 0.7;
    width: 34px;
  }

  .empty p {
    font-size: 0.92rem;
    margin: 0;
    max-width: 34ch;
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 860px) {
    .workspace {
      box-shadow: 8px 8px 0 var(--ink);
      grid-template-columns: 1fr;
    }

    .ledger {
      gap: 24px;
      padding: 28px 24px;
    }

    .stats {
      border-top: none;
      column-gap: 12px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    .stat {
      align-content: start;
      align-items: start;
      border: 1px solid var(--cream-3);
      grid-template-columns: 1fr;
      padding: 14px;
      row-gap: 10px;
    }

    .stat-num {
      grid-row: auto;
      justify-self: start;
    }

    .board {
      padding: 28px 22px;
    }
  }

  @media (max-width: 520px) {
    .ledger,
    .board {
      padding: 22px 18px;
    }

    .input-row {
      grid-template-columns: 1fr;
    }

    .add {
      min-height: 48px;
    }

    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .tabs {
      width: 100%;
    }

    .tab {
      flex: 1;
      justify-content: center;
    }

    .clear {
      justify-content: center;
    }

    .remove {
      opacity: 1;
    }

    .stats {
      column-gap: 8px;
    }

    .stat {
      padding: 12px 10px;
    }

    .stat-num {
      font-size: 2rem;
    }
  }
`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Local";
  return `${monthNames[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, "0")}`;
};

const checkIcon = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5L6.2 12L13 4.5" stroke="#f8f1df" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const plusIcon = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.5V13.5M2.5 8H13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const closeIcon = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

const sweepIcon = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 13.5L9 7M9.5 2.5L13.5 6.5M7 4.5L11.5 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const emptyIcon = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5h16M4 12h16M4 18.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16 17.5l1.6 1.6L21 15.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const renderTab = (filter, label, count, current) => `
  <a
    class="tab"
    href="${pathForFilter(filter)}"
    data-filter="${filter}"
    data-fragment-prefetch="intent"
    ${current === filter ? 'aria-current="page"' : ""}
  >${escapeHtml(label)} <b>${count}</b></a>
`;

const emptyText = (filter) => {
  if (filter === "active") return "Nothing active. Add a task above, or switch filters to review your record.";
  if (filter === "completed") return "No entries closed out yet. Completed tasks land here.";
  return "The ledger is empty. Write the first entry above.";
};

const renderTask = (task, index) => `
  <li class="task" data-task-id="${escapeHtml(task.id)}" data-completed="${task.completed ? "true" : "false"}">
    <span class="index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
    <label class="check">
      <input
        type="checkbox"
        data-action="toggle"
        data-task-id="${escapeHtml(task.id)}"
        aria-label="${task.completed ? "Mark active" : "Mark complete"}: ${escapeHtml(task.title)}"
        ${task.completed ? "checked" : ""}
      />
      <span class="check-mark" aria-hidden="true">${checkIcon}</span>
    </label>
    <div class="task-body">
      <p class="task-title">${escapeHtml(task.title)}</p>
      <time datetime="${escapeHtml(task.createdAt)}">${formatDate(task.createdAt)}</time>
    </div>
    <button class="remove" type="button" data-action="remove" data-task-id="${escapeHtml(task.id)}" aria-label="Remove ${escapeHtml(task.title)}">
      ${closeIcon}
    </button>
  </li>
`;

const renderStat = (key, label, count, total) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return `
    <div class="stat" data-key="${key}">
      <span class="stat-key">${escapeHtml(label)}</span>
      <strong class="stat-num">${count}</strong>
      <span class="stat-bar"><i style="width:${pct}%"></i></span>
    </div>
  `;
};

export const renderTodoAppShadow = (state, options = {}) => {
  const normalized = normalizeState(state);
  const filter = normalizeFilter(normalized.filter);
  const counts = countTasks(normalized.tasks);
  const tasks = visibleTasks(normalized);
  const message = options.message ?? "Saved locally in this browser.";

  return `<section class="workspace" data-filter="${filter}">
    <aside class="ledger" aria-label="Task summary">
      <div class="brand">
        <p class="eyebrow">Native Fragments &middot; Local-first</p>
        <h1 class="serif">Task <em>ledger.</em></h1>
        <p class="lede">A zero-build Worker app. State is owned by your browser and hydrated into a server-rendered Shadow DOM island.</p>
      </div>
      <div class="stats" aria-label="Task counts">
        ${renderStat("all", "Entries", counts.all, counts.all)}
        ${renderStat("active", "Open", counts.active, counts.all)}
        ${renderStat("completed", "Closed", counts.completed, counts.all)}
      </div>
      <p class="stamp">
        <span class="stamp-key">Last write</span>
        <span class="stamp-val">${formatDate(normalized.savedAt)}</span>
      </p>
    </aside>

    <section class="board" aria-label="Todo list">
      <form class="composer" data-action="add">
        <label for="new-task">New entry</label>
        <div class="input-row">
          <input id="new-task" name="title" autocomplete="off" maxlength="80" required placeholder="Name the next small thing&hellip;" />
          <button class="add" type="submit">${plusIcon}<span>Add</span></button>
        </div>
        <p class="form-note" role="status">${escapeHtml(message)}</p>
      </form>

      <div class="toolbar">
        <nav class="tabs" aria-label="Task filters">
          ${renderTab("all", "All", counts.all, filter)}
          ${renderTab("active", "Active", counts.active, filter)}
          ${renderTab("completed", "Done", counts.completed, filter)}
        </nav>
        <button class="clear" type="button" data-action="clear-completed" ${counts.completed === 0 ? "disabled" : ""}>
          ${sweepIcon}<span>Clear done</span>
        </button>
      </div>

      <ul class="tasks" aria-live="polite">
        ${
          tasks.length
            ? tasks.map(renderTask).join("")
            : `<li class="empty">${emptyIcon}<p>${escapeHtml(emptyText(filter))}</p></li>`
        }
      </ul>
    </section>
  </section>`;
};
