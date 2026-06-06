export const commands = [
  {
    id: "open-dashboard",
    keys: "G D",
    label: "Open dashboard",
    section: "Navigation",
  },
  {
    id: "toggle-theme",
    keys: "T",
    label: "Toggle theme",
    section: "Preferences",
  },
  {
    id: "copy-deploy-url",
    keys: "C U",
    label: "Copy deploy URL",
    section: "Deployment",
  },
  {
    id: "create-worker",
    keys: "N W",
    label: "Create Worker",
    section: "Deployment",
  },
  {
    id: "focus-search",
    keys: "/",
    label: "Focus search",
    section: "Navigation",
  },
];

export const paletteStyles = `
  :host {
    display: block;
  }

  .palette {
    background: #141414;
    border: 1px solid rgba(247, 243, 232, 0.16);
    color: #f7f3e8;
    display: grid;
    gap: 0.85rem;
    padding: clamp(1rem, 3vw, 1.5rem);
  }

  label {
    display: grid;
    gap: 0.55rem;
  }

  span {
    color: #a8a197;
    font: 700 0.72rem ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  input {
    background: #232323;
    border: 1px solid rgba(247, 243, 232, 0.18);
    color: #f7f3e8;
    font: inherit;
    min-height: 3.2rem;
    padding: 0.8rem 1rem;
  }

  ul {
    display: grid;
    gap: 0.45rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    align-items: center;
    border: 1px solid rgba(247, 243, 232, 0.1);
    display: grid;
    gap: 0.8rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 0.85rem;
  }

  li[data-active="true"] {
    border-color: #1ed760;
  }

  strong {
    display: block;
    font-size: 1rem;
  }

  small,
  kbd {
    color: #a8a197;
    font: 700 0.72rem ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  kbd {
    background: rgba(247, 243, 232, 0.08);
    border: 1px solid rgba(247, 243, 232, 0.18);
    color: #1ed760;
    padding: 0.25rem 0.45rem;
  }
`;

export const searchCommands = (query = "") => {
  const needle = query.trim().toLowerCase();
  if (!needle) return commands;

  return commands.filter((command) =>
    `${command.label} ${command.section} ${command.keys}`.toLowerCase().includes(needle),
  );
};

export const commandListHtml = (items = commands, activeIndex = 0) =>
  items
    .map(
      (command, index) => `<li data-command-id="${command.id}" data-active="${index === activeIndex}">
    <div>
      <strong>${command.label}</strong>
      <small>${command.section}</small>
    </div>
    <kbd>${command.keys}</kbd>
  </li>`,
    )
    .join("");

export const paletteHtml = (items = commands, activeIndex = 0) => `<section class="palette">
  <label>
    <span>Command search</span>
    <input autocomplete="off" placeholder="Type a command" />
  </label>
  <ul>${commandListHtml(items, activeIndex)}</ul>
</section>`;
