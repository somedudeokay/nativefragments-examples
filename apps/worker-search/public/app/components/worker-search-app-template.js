const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const workerSearchStyles = `
  :host {
    display: block;
  }

  .search-app {
    background: #fffdf7;
    border: 1px solid rgba(22, 22, 21, 0.14);
    border-radius: 8px;
    box-shadow: 0 24px 70px rgba(50, 45, 35, 0.10);
    color: #171612;
    margin: 0 auto;
    max-width: 1120px;
    overflow: clip;
  }

  .toolbar {
    align-items: end;
    border-bottom: 1px solid rgba(22, 22, 21, 0.1);
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(220px, 1fr) auto;
    padding: clamp(18px, 3vw, 30px);
  }

  label {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .label-text {
    color: #595348;
    font-size: 0.78rem;
    font-weight: 740;
    text-transform: uppercase;
  }

  input {
    appearance: none;
    background: #f4f1e8;
    border: 1px solid rgba(22, 22, 21, 0.18);
    border-radius: 7px;
    color: #171612;
    font: inherit;
    font-size: clamp(1.15rem, 2.2vw, 1.7rem);
    font-weight: 720;
    min-width: 0;
    outline: none;
    padding: 15px 16px;
    width: 100%;
  }

  input:focus {
    border-color: #9e4f12;
    box-shadow: 0 0 0 4px rgba(158, 79, 18, 0.14);
  }

  .stats {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(92px, 1fr));
  }

  .stat {
    border-left: 1px solid rgba(22, 22, 21, 0.14);
    padding-left: 15px;
  }

  .stat strong {
    display: block;
    font-size: 1.18rem;
  }

  .stat span {
    color: #6d675e;
    display: block;
    font-size: 0.74rem;
    margin-top: 2px;
    text-transform: uppercase;
  }

  .meta {
    align-items: center;
    background: #1b1a17;
    color: #f7f0e3;
    display: flex;
    font-size: 0.84rem;
    justify-content: space-between;
    min-height: 44px;
    padding: 10px clamp(18px, 3vw, 30px);
  }

  .meta code {
    background: rgba(255, 255, 255, 0.09);
    border-radius: 5px;
    color: #f2c17b;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.78rem;
    padding: 3px 6px;
  }

  .results {
    display: grid;
  }

  .row {
    align-items: center;
    border-bottom: 1px solid rgba(22, 22, 21, 0.09);
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(150px, 0.8fr) minmax(200px, 1.4fr) auto;
    min-height: 82px;
    padding: 16px clamp(18px, 3vw, 30px);
  }

  .row:last-child {
    border-bottom: 0;
  }

  .id {
    color: #7b7469;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.78rem;
  }

  .title {
    display: grid;
    gap: 5px;
    min-width: 0;
  }

  .title strong {
    font-size: 1.02rem;
    overflow-wrap: anywhere;
  }

  .title span {
    color: #665f54;
    font-size: 0.88rem;
    overflow-wrap: anywhere;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: end;
  }

  .tags span {
    background: #ece6d9;
    border-radius: 999px;
    color: #4d463b;
    font-size: 0.74rem;
    font-weight: 690;
    padding: 5px 8px;
  }

  .empty {
    color: #655d51;
    padding: 34px clamp(18px, 3vw, 30px);
  }

  @media (max-width: 780px) {
    .toolbar {
      align-items: stretch;
      grid-template-columns: 1fr;
    }

    .stats {
      grid-template-columns: repeat(3, 1fr);
    }

    .stat:first-child {
      border-left: 0;
      padding-left: 0;
    }

    .meta {
      align-items: flex-start;
      flex-direction: column;
      gap: 6px;
    }

    .row {
      align-items: start;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .tags {
      justify-content: start;
    }
  }
`;

export const renderRows = (rows) => {
  if (!rows.length) {
    return `<p class="empty">No matching rows. Try worker, edge, Oslo, identity, or analytics.</p>`;
  }

  return rows
    .map(
      (row) => `
        <article class="row">
          <span class="id">${escapeHtml(row.id)}</span>
          <span class="title">
            <strong>${escapeHtml(row.title)}</strong>
            <span>${escapeHtml(row.summary)}</span>
          </span>
          <span class="tags">
            ${row.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </span>
        </article>
      `,
    )
    .join("");
};

export const renderSearchApp = ({ rows, stats }) => `
  <section class="search-app" aria-label="Worker search demo">
    <div class="toolbar">
      <label>
        <span class="label-text">Search ${escapeHtml(stats.records)} generated records</span>
        <input
          data-search-input
          type="search"
          name="query"
          placeholder="Try worker, edge, Oslo..."
          autocomplete="off"
          spellcheck="false"
        />
      </label>
      <div class="stats" aria-label="Dataset summary">
        <span class="stat">
          <strong>${escapeHtml(stats.records)}</strong>
          <span>records</span>
        </span>
        <span class="stat">
          <strong>${escapeHtml(stats.categories)}</strong>
          <span>domains</span>
        </span>
        <span class="stat">
          <strong>${escapeHtml(stats.regions)}</strong>
          <span>regions</span>
        </span>
      </div>
    </div>
    <div class="meta">
      <span data-search-status>Server rendered ${escapeHtml(rows.length)} rows before JavaScript.</span>
      <code>/nativefragments/worker.js RPC</code>
    </div>
    <div class="results" data-search-results aria-live="polite">
      ${renderRows(rows)}
    </div>
  </section>
`;

export const serializeSearchState = (state) =>
  JSON.stringify(state).replace(/</g, "\\u003c");
