import {
  countTasks,
  normalizeFilter,
  normalizeState,
  pathForFilter,
  visibleTasks,
} from "../model/todo-state.js";

export const todoAppStyles = `
  :host {
    display: block;
    color: #151515;
    font-family: "Avenir Next", "Gill Sans", ui-sans-serif, system-ui, sans-serif;
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

  .workspace {
    background: #fbf7eb;
    border: 1px solid #151515;
    box-shadow: 10px 10px 0 #151515;
    display: grid;
    grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.25fr);
    min-height: 720px;
    overflow: hidden;
  }

  .ledger {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 32%),
      #151515;
    color: #f8f1df;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    padding: 34px;
  }

  .brand {
    border-bottom: 1px solid rgba(248, 241, 223, 0.2);
    padding-bottom: 28px;
  }

  .eyebrow,
  .label,
  .meta,
  .tab span,
  .empty,
  .stamp,
  .task time,
  .remove {
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .eyebrow,
  .label,
  .meta,
  .tab span,
  .empty,
  .stamp,
  .task time {
    font-size: 0.72rem;
  }

  .eyebrow {
    color: #8fe1a2;
    font-weight: 800;
    margin: 0 0 18px;
  }

  h1 {
    font-family: "Iowan Old Style", "Palatino Linotype", ui-serif, Georgia, serif;
    font-size: 2.35rem;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    max-width: 9ch;
  }

  .lede {
    color: rgba(248, 241, 223, 0.72);
    font-size: 1rem;
    margin: 22px 0 0;
    max-width: 29ch;
  }

  .stats {
    display: grid;
    gap: 12px;
    margin: 34px 0;
  }

  .stat {
    align-items: end;
    border: 1px solid rgba(248, 241, 223, 0.18);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    min-height: 82px;
    padding: 15px;
  }

  .stat strong {
    color: #f8f1df;
    font-family: "Iowan Old Style", "Palatino Linotype", ui-serif, Georgia, serif;
    font-size: 2rem;
    line-height: 0.9;
  }

  .label,
  .meta {
    color: rgba(248, 241, 223, 0.58);
    font-weight: 800;
  }

  .stamp {
    color: #8fe1a2;
    font-weight: 800;
    margin-top: auto;
  }

  .board {
    display: flex;
    flex-direction: column;
    gap: 22px;
    min-width: 0;
    padding: 34px;
  }

  .composer {
    border-bottom: 1px solid rgba(21, 21, 21, 0.16);
    display: grid;
    gap: 10px;
    padding-bottom: 22px;
  }

  .composer label {
    color: #4c463b;
    font-size: 0.88rem;
    font-weight: 800;
  }

  .input-row {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) 88px;
  }

  input[name="title"] {
    background: #fffef8;
    border: 1px solid rgba(21, 21, 21, 0.24);
    border-radius: 6px;
    color: #151515;
    min-height: 48px;
    min-width: 0;
    outline: none;
    padding: 0 14px;
  }

  input[name="title"]:focus {
    border-color: #151515;
    box-shadow: 0 0 0 3px rgba(143, 225, 162, 0.55);
  }

  .add,
  .clear,
  .remove {
    align-items: center;
    border: 1px solid #151515;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    font-weight: 850;
    justify-content: center;
    min-height: 40px;
  }

  .add {
    background: #8fe1a2;
    color: #151515;
    min-height: 48px;
  }

  .add:hover,
  .clear:hover,
  .remove:hover {
    transform: translate(-1px, -1px);
  }

  .form-note {
    color: #665f52;
    font-size: 0.88rem;
    margin: 0;
    min-height: 1.4em;
  }

  .toolbar {
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .tabs {
    background: #eee5d2;
    border: 1px solid rgba(21, 21, 21, 0.12);
    border-radius: 8px;
    display: flex;
    gap: 4px;
    padding: 4px;
  }

  .tab {
    align-items: center;
    border-radius: 5px;
    color: #3d3933;
    display: inline-flex;
    gap: 7px;
    min-height: 34px;
    padding: 0 10px;
    text-decoration: none;
  }

  .tab[aria-current="page"] {
    background: #151515;
    color: #f8f1df;
  }

  .tab span {
    color: currentColor;
    font-weight: 850;
    opacity: 0.72;
  }

  .clear {
    background: transparent;
    color: #151515;
    padding: 0 12px;
  }

  .clear:disabled {
    cursor: not-allowed;
    opacity: 0.42;
    transform: none;
  }

  .tasks {
    display: grid;
    gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .task {
    align-items: center;
    background: #fffef8;
    border: 1px solid rgba(21, 21, 21, 0.16);
    border-radius: 8px;
    display: grid;
    gap: 12px;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    min-height: 76px;
    padding: 12px;
  }

  .task[data-completed="true"] {
    background: #f1eadb;
  }

  .check {
    display: grid;
    height: 34px;
    place-items: center;
    position: relative;
    width: 34px;
  }

  .check input {
    height: 34px;
    margin: 0;
    opacity: 0;
    position: absolute;
    width: 34px;
  }

  .check-mark {
    align-items: center;
    background: #fbf7eb;
    border: 1px solid #151515;
    border-radius: 5px;
    display: flex;
    height: 26px;
    justify-content: center;
    width: 26px;
  }

  .check input:checked + .check-mark {
    background: #8fe1a2;
  }

  .check input:checked + .check-mark::after {
    content: "";
    border-bottom: 2px solid #151515;
    border-right: 2px solid #151515;
    display: block;
    height: 11px;
    transform: rotate(42deg) translate(-1px, -1px);
    width: 6px;
  }

  .task-title {
    color: #151515;
    font-size: 1rem;
    font-weight: 850;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .task[data-completed="true"] .task-title {
    color: #676052;
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }

  .task time {
    color: #756d5d;
    display: inline-block;
    font-weight: 800;
    margin-top: 4px;
  }

  .remove {
    background: #fffef8;
    color: #151515;
    font-size: 0.68rem;
    min-width: 72px;
    padding: 0 10px;
  }

  .empty {
    border: 1px dashed rgba(21, 21, 21, 0.28);
    border-radius: 8px;
    color: #655e52;
    font-weight: 850;
    min-height: 96px;
    padding: 28px;
    text-align: center;
  }

  @media (max-width: 820px) {
    .workspace {
      box-shadow: 6px 6px 0 #151515;
      grid-template-columns: 1fr;
      min-height: auto;
    }

    .ledger,
    .board {
      padding: 24px;
    }

    .stats {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-bottom: 0;
    }

    .stat {
      min-height: 74px;
    }

    h1 {
      font-size: 2rem;
      max-width: none;
    }
  }

  @media (max-width: 560px) {
    .ledger,
    .board {
      padding: 18px;
    }

    .input-row,
    .task {
      grid-template-columns: 1fr;
    }

    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .tab {
      justify-content: center;
      padding: 0 6px;
    }

    .stats {
      gap: 8px;
    }

    .stat {
      align-items: start;
      flex-direction: column;
      min-height: 88px;
    }

    .remove {
      width: 100%;
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

const renderTab = (filter, label, count, current) => `
  <a
    class="tab"
    href="${pathForFilter(filter)}"
    data-filter="${filter}"
    data-fragment-prefetch="intent"
    ${current === filter ? 'aria-current="page"' : ""}
  >${escapeHtml(label)} <span>${count}</span></a>
`;

const emptyText = (filter) => {
  if (filter === "active") return "No active tasks. Add one above or switch filters.";
  if (filter === "completed") return "No completed tasks yet.";
  return "No tasks yet. Add the first one above.";
};

const renderTask = (task) => `
  <li class="task" data-task-id="${escapeHtml(task.id)}" data-completed="${task.completed ? "true" : "false"}">
    <label class="check">
      <input
        type="checkbox"
        data-action="toggle"
        data-task-id="${escapeHtml(task.id)}"
        aria-label="${task.completed ? "Mark active" : "Mark complete"}: ${escapeHtml(task.title)}"
        ${task.completed ? "checked" : ""}
      />
      <span class="check-mark" aria-hidden="true"></span>
    </label>
    <div>
      <p class="task-title">${escapeHtml(task.title)}</p>
      <time datetime="${escapeHtml(task.createdAt)}">${formatDate(task.createdAt)}</time>
    </div>
    <button class="remove" type="button" data-action="remove" data-task-id="${escapeHtml(task.id)}" aria-label="Remove ${escapeHtml(task.title)}">
      Remove
    </button>
  </li>
`;

export const renderTodoAppShadow = (state, options = {}) => {
  const normalized = normalizeState(state);
  const filter = normalizeFilter(normalized.filter);
  const counts = countTasks(normalized.tasks);
  const tasks = visibleTasks(normalized);
  const message = options.message ?? "Saved locally in this browser.";

  return `<section class="workspace" data-filter="${filter}">
    <aside class="ledger" aria-label="Task summary">
      <div>
        <div class="brand">
          <p class="eyebrow">Native Fragments demo</p>
          <h1>Local task ledger.</h1>
          <p class="lede">A zero-build Worker app with browser-owned state and a hydrated Shadow DOM island.</p>
        </div>
        <div class="stats" aria-label="Task counts">
          <div class="stat">
            <span class="label">All</span>
            <strong>${counts.all}</strong>
          </div>
          <div class="stat">
            <span class="label">Active</span>
            <strong>${counts.active}</strong>
          </div>
          <div class="stat">
            <span class="label">Done</span>
            <strong>${counts.completed}</strong>
          </div>
        </div>
      </div>
      <p class="stamp">Last write ${formatDate(normalized.savedAt)}</p>
    </aside>

    <section class="board" aria-label="Todo list">
      <form class="composer" data-action="add">
        <label for="new-task">New task</label>
        <div class="input-row">
          <input id="new-task" name="title" autocomplete="off" maxlength="80" required placeholder="Name the next small thing" />
          <button class="add" type="submit">Add</button>
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
          Clear done
        </button>
      </div>

      <ul class="tasks" aria-live="polite">
        ${
          tasks.length
            ? tasks.map(renderTask).join("")
            : `<li class="empty">${escapeHtml(emptyText(filter))}</li>`
        }
      </ul>
    </section>
  </section>`;
};
