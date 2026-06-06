const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SORT_OPTIONS = [
  ["mass", "Mass"],
  ["year", "Year"],
  ["name", "Name"],
  ["class", "Class"],
  ["relevance", "Relevance"],
];

// Maps a clickable column header to the sort key it controls.
const COLUMNS = [
  { key: "name", label: "Specimen", sort: "name", align: "start" },
  { key: "class", label: "Class", sort: "class", align: "start" },
  { key: "mass", label: "Mass", sort: "mass", align: "end", num: true },
  { key: "year", label: "Year", sort: "year", align: "end", num: true },
  { key: "coords", label: "Location", sort: null, align: "start" },
];

export const workerSearchStyles = `
  :host {
    display: block;
  }

  .panel {
    background: var(--surface, #fbf9f3);
    border: 1px solid var(--line-strong, #d9d3c4);
    border-radius: 4px;
    color: #1a1813;
    margin: 0 auto;
    max-width: 1180px;
    overflow: clip;
  }

  .toolbar {
    align-items: stretch;
    display: grid;
    gap: 0;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--line-strong, #d9d3c4);
  }

  .field-search {
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    padding: 0 18px;
    min-width: 0;
  }

  .field-search svg {
    color: #6b6456;
    flex: none;
    height: 18px;
    width: 18px;
  }

  input[type="search"] {
    appearance: none;
    background: transparent;
    border: 0;
    color: #1a1813;
    font: inherit;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    font-weight: 500;
    letter-spacing: -0.01em;
    min-width: 0;
    outline: none;
    padding: 18px 0;
    width: 100%;
  }

  input[type="search"]::placeholder {
    color: #6b645a;
    font-weight: 400;
  }

  input[type="search"]::-webkit-search-cancel-button {
    appearance: none;
  }

  .field-sort {
    align-items: center;
    border-left: 1px solid var(--line, #e6e0d2);
    display: flex;
    gap: 10px;
    padding: 0 16px 0 18px;
  }

  .field-sort .label-text {
    color: #6b6456;
    flex: none;
  }

  .label-text {
    font-family: var(--mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  select {
    appearance: none;
    background: transparent;
    border: 0;
    color: #1a1813;
    cursor: pointer;
    font: inherit;
    font-size: 0.92rem;
    font-weight: 600;
    outline: none;
    padding: 18px 22px 18px 0;
    background-image:
      linear-gradient(45deg, transparent 50%, #1a1813 50%),
      linear-gradient(135deg, #1a1813 50%, transparent 50%);
    background-position:
      calc(100% - 8px) calc(50% + 1px),
      calc(100% - 3px) calc(50% + 1px);
    background-repeat: no-repeat;
    background-size: 5px 5px;
  }

  input[type="search"]:focus-visible,
  .field-search:focus-within {
    outline: none;
  }

  .field-search:focus-within {
    box-shadow: inset 0 -2px 0 var(--accent, #b14d1f);
  }

  select:focus-visible {
    box-shadow: inset 0 -2px 0 var(--accent, #b14d1f);
  }

  .statusbar {
    align-items: center;
    background: #16140f;
    color: #f4ede0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    justify-content: space-between;
    padding: 9px 18px;
  }

  .statusbar .status-text {
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
  }

  .statusbar .status-text b {
    color: #f0b46a;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }

  .statusbar code {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    color: #e7c79a;
    font-family: var(--mono);
    font-size: 0.72rem;
    letter-spacing: 0.02em;
    padding: 3px 7px;
    white-space: nowrap;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }

  .cg-name { width: 30%; }
  .cg-class { width: 20%; }
  .cg-mass { width: 14%; }
  .cg-year { width: 11%; }
  .cg-coords { width: 25%; }

  thead th {
    background: #f2eee2;
    border-bottom: 1px solid var(--line-strong, #d9d3c4);
    color: #6b6453;
    font-family: var(--mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    padding: 0;
    text-align: start;
    text-transform: uppercase;
  }

  thead th.num {
    text-align: end;
  }

  thead th button {
    align-items: center;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 5px;
    letter-spacing: inherit;
    padding: 11px 16px;
    text-transform: inherit;
    width: 100%;
  }

  thead th.num button {
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  thead th button:hover {
    color: #1a1813;
  }

  thead th button .arrow {
    color: var(--accent, #b14d1f);
    flex: none;
    height: 9px;
    opacity: 0;
    width: 9px;
  }

  thead th[aria-sort] button .arrow {
    opacity: 1;
  }

  thead th[aria-sort] button {
    color: #1a1813;
  }

  thead th[aria-sort="ascending"] button .arrow {
    transform: rotate(180deg);
  }

  thead th.static {
    color: #6b645a;
    padding: 11px 16px;
  }

  thead th:focus-visible button,
  thead th button:focus-visible {
    outline: 2px solid var(--accent, #b14d1f);
    outline-offset: -2px;
  }

  tbody td {
    border-bottom: 1px solid var(--line, #ece6d8);
    padding: 11px 16px;
    vertical-align: baseline;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover td {
    background: #f6f2e7;
  }

  .c-name {
    font-size: 0.96rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .c-name .fall {
    color: #6b645a;
    font-family: var(--mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    margin-left: 8px;
    text-transform: uppercase;
    vertical-align: 1px;
  }

  .c-class {
    color: #4d4636;
    font-family: var(--mono);
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .c-num {
    font-family: var(--mono);
    font-size: 0.86rem;
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  }

  .c-num .unit {
    color: #6b645a;
    font-size: 0.78em;
  }

  .c-num.muted {
    color: #b3aa97;
  }

  .c-coords {
    color: #5c5544;
    font-family: var(--mono);
    font-size: 0.78rem;
    font-variant-numeric: tabular-nums;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .c-coords .region {
    color: #a59b87;
  }

  .empty {
    color: #5c5544;
    display: grid;
    gap: 6px;
    padding: 56px 18px;
    text-align: center;
  }

  .empty strong {
    font-size: 1.05rem;
    font-weight: 600;
  }

  .empty span {
    color: #6b6456;
    font-size: 0.88rem;
  }

  @media (max-width: 760px) {
    .toolbar {
      grid-template-columns: 1fr;
    }

    .field-sort {
      border-left: 0;
      border-top: 1px solid var(--line, #e6e0d2);
      padding: 0 18px;
    }

    .field-sort .label-text {
      flex: 1;
    }

    select {
      padding-block: 14px;
    }

    .cg-name { width: 50%; }
    .cg-class { width: 28%; }
    .cg-mass { width: 22%; }
    .cg-year,
    .cg-coords { width: 0; }

    .col-year,
    .col-coords {
      display: none;
    }

    .c-name {
      white-space: normal;
    }
  }

  @media (max-width: 460px) {
    .cg-name { width: auto; }
    .cg-mass { width: 30%; }
    .cg-class { width: 0; }

    .col-class {
      display: none;
    }

    .c-name .fall {
      display: none;
    }
  }
`;

const formatMass = (mass) => {
  if (mass == null) return `<span class="c-num muted">—</span>`;
  if (mass >= 1_000_000) {
    return `${(mass / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}<span class="unit"> t</span>`;
  }
  if (mass >= 1000) {
    return `${(mass / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}<span class="unit"> kg</span>`;
  }
  return `${Math.round(mass).toLocaleString()}<span class="unit"> g</span>`;
};

const formatCoords = (row) => {
  if (row.lat == null || row.lon == null) {
    return `<span class="region">${escapeHtml(row.region ?? "unknown")}</span>`;
  }
  const lat = `${Math.abs(row.lat).toFixed(2)}°${row.lat >= 0 ? "N" : "S"}`;
  const lon = `${Math.abs(row.lon).toFixed(2)}°${row.lon >= 0 ? "E" : "W"}`;
  return `${lat}, ${lon}`;
};

export const renderRows = (rows) => {
  if (!rows.length) {
    return `
      <tr>
        <td colspan="5">
          <div class="empty">
            <strong>No meteorites match that query.</strong>
            <span>Try Hoba, lunar, iron, Antarctica, 1880, or tonne-class.</span>
          </div>
        </td>
      </tr>`;
  }

  return rows
    .map(
      (row) => `
        <tr>
          <td class="col-name">
            <div class="c-name">${escapeHtml(row.name)}<span class="fall">${escapeHtml(row.fall ?? "")}</span></div>
          </td>
          <td class="col-class"><div class="c-class">${escapeHtml(row.recclass ?? "—")}</div></td>
          <td class="col-mass"><div class="c-num">${formatMass(row.mass)}</div></td>
          <td class="col-year"><div class="c-num${row.year == null ? " muted" : ""}">${escapeHtml(row.year ?? "—")}</div></td>
          <td class="col-coords"><div class="c-coords">${formatCoords(row)}</div></td>
        </tr>
      `,
    )
    .join("");
};

const arrowSvg = `<svg class="arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2.5v7M3 6.5L6 9.5 9 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const renderHead = (sort) =>
  COLUMNS.map((col) => {
    const cls = col.num ? "num" : "";
    const colClass = `col-${col.key}`;
    if (!col.sort) {
      return `<th class="static ${colClass}">${escapeHtml(col.label)}</th>`;
    }
    const active = col.sort === sort;
    const ariaSort = active ? ` aria-sort="descending"` : "";
    return `<th class="${cls} ${colClass}"${ariaSort}><button type="button" data-sort-col="${col.sort}">${escapeHtml(col.label)}${arrowSvg}</button></th>`;
  }).join("");

export const renderSearchApp = ({ rows, stats, sort = "mass", query = "" }) => `
  <section class="panel" aria-label="Meteorite catalog search">
    <div class="toolbar">
      <div class="field-search">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M13.5 13.5 17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <input
          data-search-input
          type="search"
          name="query"
          value="${escapeHtml(query)}"
          placeholder="Search ${escapeHtml(stats.records.toLocaleString())} NASA meteorite records…"
          aria-label="Search ${escapeHtml(stats.records.toLocaleString())} real meteorites"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
      <div class="field-sort">
        <span class="label-text" id="sort-label">Sort</span>
        <select data-sort-select name="sort" aria-labelledby="sort-label">
          ${SORT_OPTIONS.map(([value, label]) => `<option value="${value}"${value === sort ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="statusbar">
      <span class="status-text" data-search-status>Server rendered <b>${escapeHtml(rows.length)}</b> rows before JavaScript.</span>
      <code>/nativefragments/worker.js RPC</code>
    </div>
    <table data-search-table>
      <colgroup>
        <col class="cg-name" />
        <col class="cg-class" />
        <col class="cg-mass" />
        <col class="cg-year" />
        <col class="cg-coords" />
      </colgroup>
      <thead data-search-head>
        <tr>${renderHead(sort)}</tr>
      </thead>
      <tbody data-search-results aria-live="polite">
        ${renderRows(rows)}
      </tbody>
    </table>
  </section>
`;

export { renderHead };

export const serializeSearchState = (state) =>
  JSON.stringify(state).replace(/</g, "\\u003c");
