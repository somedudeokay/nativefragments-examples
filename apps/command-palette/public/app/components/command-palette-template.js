// Inline SVG glyphs (no icon fonts / emoji). 16px on a 24 viewBox grid.
const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z"/></svg>`,
  theme: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.5-.04-1-.12-1.48A6 6 0 0 1 12.5 3.1 9.3 9.3 0 0 0 12 3z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h9a2 2 0 0 1 2 2v9h-2V6H9zM5 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zm0 2v9h9v-9z"/></svg>`,
  worker: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2l.4 2.3a7.4 7.4 0 0 1 2 .85l1.95-1.3 1.4 1.4-1.3 1.95c.36.62.65 1.29.85 2L21 12v2l-2.3.4c-.2.71-.49 1.38-.85 2l1.3 1.95-1.4 1.4-1.95-1.3c-.62.36-1.29.65-2 .85L13 22h-2l-.4-2.3a7.4 7.4 0 0 1-2-.85l-1.95 1.3-1.4-1.4 1.3-1.95a7.4 7.4 0 0 1-.85-2L3 14v-2l2.3-.4c.2-.71.49-1.38.85-2L4.85 7.65l1.4-1.4L8.2 7.55c.62-.36 1.29-.65 2-.85zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.13l4.24 4.24-1.42 1.42-4.24-4.24A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>`,
};

export const commands = [
  {
    icon: "dashboard",
    id: "open-dashboard",
    keys: "G D",
    label: "Open dashboard",
    section: "Navigation",
  },
  {
    icon: "search",
    id: "focus-search",
    keys: "/",
    label: "Focus search",
    section: "Navigation",
  },
  {
    icon: "theme",
    id: "toggle-theme",
    keys: "T",
    label: "Toggle theme",
    section: "Preferences",
  },
  {
    icon: "copy",
    id: "copy-deploy-url",
    keys: "C U",
    label: "Copy deploy URL",
    section: "Deployment",
  },
  {
    icon: "worker",
    id: "create-worker",
    keys: "N W",
    label: "Create Worker",
    section: "Deployment",
  },
];

export const paletteStyles = `
  :host {
    display: block;
  }

  * {
    box-sizing: border-box;
  }

  .palette {
    --bg: #16161a;
    --bg-raised: #202027;
    --hair: rgba(255, 255, 255, 0.08);
    --hair-strong: rgba(255, 255, 255, 0.14);
    --text: #f4f3ee;
    --dim: #9a978f;
    --accent: #1ed760;
    background: linear-gradient(180deg, #1b1b20, #131316);
    border: 1px solid var(--hair-strong);
    border-radius: 16px;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.05) inset,
      0 24px 60px -18px rgba(0, 0, 0, 0.7),
      0 8px 22px -12px rgba(0, 0, 0, 0.6);
    color: var(--text);
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    overflow: hidden;
  }

  .field {
    align-items: center;
    border-bottom: 1px solid var(--hair);
    display: grid;
    gap: 0.75rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 0.95rem 1.1rem;
  }

  .field .lead {
    color: var(--dim);
    display: grid;
    height: 22px;
    place-items: center;
    width: 22px;
  }

  .field .lead svg {
    fill: currentColor;
    height: 20px;
    width: 20px;
  }

  input {
    background: transparent;
    border: 0;
    color: var(--text);
    font: 500 1.12rem/1.3 ui-sans-serif, system-ui, -apple-system, sans-serif;
    letter-spacing: -0.01em;
    min-width: 0;
    outline: none;
    padding: 0.2rem 0;
  }

  input::placeholder {
    color: var(--dim);
  }

  .field kbd {
    background: var(--bg-raised);
    border: 1px solid var(--hair-strong);
    border-radius: 6px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    color: var(--dim);
    font: 600 0.72rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    padding: 0.32rem 0.5rem;
  }

  .scroller {
    max-height: min(58vh, 460px);
    overflow-y: auto;
    padding: 0.4rem;
    scrollbar-width: thin;
  }

  .group {
    margin: 0;
    padding: 0;
  }

  .group + .group {
    margin-top: 0.15rem;
  }

  .group .group-label {
    color: var(--dim);
    font: 700 0.66rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.14em;
    margin: 0;
    padding: 0.7rem 0.85rem 0.4rem;
    text-transform: uppercase;
  }

  ul {
    display: grid;
    gap: 1px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    align-items: center;
    border: 1px solid transparent;
    border-radius: 10px;
    color: var(--text);
    cursor: default;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 0.62rem 0.7rem;
  }

  li .glyph {
    color: var(--dim);
    display: grid;
    height: 28px;
    place-items: center;
    width: 28px;
  }

  li .glyph svg {
    fill: currentColor;
    height: 18px;
    width: 18px;
  }

  li strong {
    display: block;
    font: 500 0.96rem/1.25 ui-sans-serif, system-ui, -apple-system, sans-serif;
    letter-spacing: -0.005em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li[data-active="true"] {
    background: rgba(30, 215, 96, 0.12);
    border-color: rgba(30, 215, 96, 0.4);
  }

  li[data-active="true"] .glyph,
  li[data-active="true"] strong {
    color: #eafff1;
  }

  li[data-active="true"] .glyph {
    color: var(--accent);
  }

  .keys {
    display: flex;
    gap: 0.3rem;
  }

  .keys kbd {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--hair-strong);
    border-radius: 6px;
    color: var(--dim);
    font: 600 0.72rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    min-width: 1.55rem;
    padding: 0.28rem 0.42rem;
    text-align: center;
  }

  li[data-active="true"] .keys kbd {
    border-color: rgba(30, 215, 96, 0.45);
    color: #cdebd6;
  }

  .empty {
    color: var(--dim);
    font-size: 0.92rem;
    padding: 1.6rem 0.85rem;
    text-align: center;
  }

  .hints {
    align-items: center;
    border-top: 1px solid var(--hair);
    color: var(--dim);
    display: flex;
    flex-wrap: wrap;
    font: 500 0.74rem/1 ui-sans-serif, system-ui, -apple-system, sans-serif;
    gap: 0.35rem 1.15rem;
    padding: 0.7rem 1.05rem;
  }

  .hints span {
    align-items: center;
    display: inline-flex;
    gap: 0.4rem;
  }

  .hints kbd {
    background: var(--bg-raised);
    border: 1px solid var(--hair-strong);
    border-radius: 5px;
    color: var(--text);
    font: 600 0.7rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    min-width: 1.35rem;
    padding: 0.24rem 0.35rem;
    text-align: center;
  }

  .hints .grow {
    margin-left: auto;
  }

  @media (max-width: 460px) {
    input {
      font-size: 1rem;
    }

    .hints {
      gap: 0.35rem 0.75rem;
    }

    .hints .count {
      display: none;
    }
  }
`;

export const searchCommands = (query = "") => {
  const needle = query.trim().toLowerCase();
  if (!needle) return commands;

  return commands.filter((command) =>
    `${command.label} ${command.section} ${command.keys}`.toLowerCase().includes(needle),
  );
};

const keyChips = (keys) =>
  keys
    .split(" ")
    .map((key) => `<kbd>${key}</kbd>`)
    .join("");

export const commandListHtml = (items = commands, activeIndex = 0) => {
  if (!items.length) {
    return `<p class="empty">No commands match that search.</p>`;
  }

  let html = "";
  let lastSection = null;
  let open = false;

  items.forEach((command, index) => {
    if (command.section !== lastSection) {
      if (open) html += `</ul></section>`;
      html += `<section class="group" role="group" aria-label="${command.section}"><div class="group-label" aria-hidden="true">${command.section}</div><ul role="presentation">`;
      lastSection = command.section;
      open = true;
    }

    const active = index === activeIndex;
    html += `<li role="option" aria-selected="${active}" data-command-id="${command.id}" data-active="${active}">
      <span class="glyph">${ICONS[command.icon] ?? ""}</span>
      <strong>${command.label}</strong>
      <span class="keys">${keyChips(command.keys)}</span>
    </li>`;
  });

  if (open) html += `</ul></section>`;
  return html;
};

export const paletteHtml = (items = commands, activeIndex = 0) => `<section class="palette" role="dialog" aria-label="Command palette">
  <div class="field">
    <span class="lead">${ICONS.search}</span>
    <input autocomplete="off" type="text" role="combobox" aria-expanded="true" aria-controls="cp-listbox" aria-autocomplete="list" aria-label="Search commands" placeholder="Search commands…" />
    <kbd>esc</kbd>
  </div>
  <div class="scroller" id="cp-listbox" role="listbox" aria-label="Commands">${commandListHtml(items, activeIndex)}</div>
  <div class="hints">
    <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
    <span><kbd>↵</kbd> select</span>
    <span><kbd>esc</kbd> close</span>
    <span class="grow count">${items.length} command${items.length === 1 ? "" : "s"}</span>
  </div>
</section>`;
