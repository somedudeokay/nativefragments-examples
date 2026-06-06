const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const SECTIONS = [
  {
    id: "overview",
    path: "/",
    navLabel: "Overview",
    kicker: "01",
    title: "Executive pulse",
    summary:
      "A compact operating read on traffic, activation, revenue, and platform health.",
  },
  {
    id: "acquisition",
    path: "/acquisition",
    navLabel: "Acquisition",
    kicker: "02",
    title: "Acquisition command",
    summary:
      "Channel quality, visitor intent, and conversion pressure across the funnel.",
  },
  {
    id: "revenue",
    path: "/revenue",
    navLabel: "Revenue",
    kicker: "03",
    title: "Revenue command center",
    summary:
      "Expansion, pipeline, churn risk, and payback signals in one board.",
  },
  {
    id: "reliability",
    path: "/reliability",
    navLabel: "Reliability",
    kicker: "04",
    title: "Reliability watch",
    summary:
      "Latency, incidents, error budget, and deploy quality for product teams.",
  },
];

export const RANGES = [
  { id: "7d", label: "7D", metricFactor: 0.34, deltaBias: 1.8, seriesFactor: 0.78 },
  { id: "30d", label: "30D", metricFactor: 1, deltaBias: 0, seriesFactor: 1 },
  { id: "90d", label: "90D", metricFactor: 2.86, deltaBias: -2.2, seriesFactor: 1.18 },
];

export const SEGMENTS = [
  { id: "all", label: "All users", metricFactor: 1, scoreBias: 0, deltaBias: 0 },
  { id: "team", label: "Teams", metricFactor: 0.58, scoreBias: 3.4, deltaBias: 1.2 },
  { id: "enterprise", label: "Enterprise", metricFactor: 0.26, scoreBias: 7.2, deltaBias: -0.6 },
];

const DATA = {
  overview: {
    alert: "Activation is up while error budget burn stays below target.",
    chartLabel: "Qualified sessions",
    metrics: [
      {
        id: "visitors",
        label: "Visitors",
        mode: "number",
        value: 148200,
        delta: 12.4,
        tone: "green",
        spark: [42, 48, 45, 56, 60, 58, 68, 73],
      },
      {
        id: "activation",
        label: "Activation",
        mode: "percent",
        value: 42.8,
        delta: 5.7,
        tone: "blue",
        spark: [32, 36, 35, 39, 43, 42, 45, 49],
      },
      {
        id: "mrr",
        label: "MRR",
        mode: "currency",
        value: 83600,
        delta: 9.1,
        tone: "amber",
        spark: [45, 46, 51, 55, 54, 62, 66, 71],
      },
      {
        id: "burn",
        label: "Budget burn",
        mode: "percent",
        lowerIsBetter: true,
        value: 31.5,
        delta: -3.8,
        tone: "red",
        spark: [56, 51, 48, 43, 39, 35, 32, 29],
      },
    ],
    series: [42, 48, 53, 49, 62, 66, 71, 73, 81, 78, 86, 93],
    channels: [
      ["Direct", 36, 53200, 8.2],
      ["Product-led", 27, 39900, 14.6],
      ["Partner", 19, 28100, 5.4],
      ["Search", 18, 27000, 7.1],
    ],
    events: [
      ["09:20", "Pricing experiment reached significance"],
      ["08:45", "EU traffic moved to edge cache tier"],
      ["07:50", "Trial activation cohort refreshed"],
    ],
  },
  acquisition: {
    alert: "Partner traffic is smaller but carries the highest activation rate.",
    chartLabel: "Lead quality index",
    metrics: [
      {
        id: "qualified",
        label: "Qualified visits",
        mode: "number",
        value: 58200,
        delta: 18.6,
        tone: "green",
        spark: [30, 38, 41, 45, 52, 58, 61, 72],
      },
      {
        id: "signup",
        label: "Signup rate",
        mode: "percent",
        value: 12.9,
        delta: 2.4,
        tone: "blue",
        spark: [25, 28, 31, 34, 33, 39, 42, 44],
      },
      {
        id: "cac",
        label: "CAC payback",
        mode: "months",
        value: 7.8,
        delta: -1.1,
        tone: "amber",
        spark: [62, 58, 54, 52, 49, 45, 43, 40],
      },
      {
        id: "bounce",
        label: "Bounce risk",
        mode: "percent",
        lowerIsBetter: true,
        value: 21.4,
        delta: -4.2,
        tone: "red",
        spark: [61, 57, 54, 48, 46, 39, 36, 33],
      },
    ],
    series: [36, 42, 44, 51, 58, 63, 66, 69, 76, 81, 79, 88],
    channels: [
      ["Product-led", 31, 18100, 16.4],
      ["Partner", 22, 12800, 21.2],
      ["Search", 28, 16300, 9.8],
      ["Direct", 19, 11000, 7.5],
    ],
    events: [
      ["10:05", "Partner launch page crossed 20k views"],
      ["09:10", "Search cohort quality improved 6.1 points"],
      ["08:20", "Signup copy test opened to all visitors"],
    ],
  },
  revenue: {
    alert: "Expansion revenue leads the quarter while churn risk is contained.",
    chartLabel: "Net revenue retention",
    metrics: [
      {
        id: "arr",
        label: "ARR pace",
        mode: "currency",
        value: 214000,
        delta: 16.8,
        tone: "green",
        spark: [40, 45, 49, 55, 63, 67, 75, 82],
      },
      {
        id: "nrr",
        label: "NRR",
        mode: "percent",
        value: 128.4,
        delta: 4.1,
        tone: "blue",
        spark: [54, 56, 58, 59, 64, 66, 69, 72],
      },
      {
        id: "pipeline",
        label: "Pipeline",
        mode: "currency",
        value: 492000,
        delta: 11.9,
        tone: "amber",
        spark: [44, 49, 47, 53, 59, 62, 70, 78],
      },
      {
        id: "churn",
        label: "Churn risk",
        mode: "percent",
        lowerIsBetter: true,
        value: 4.7,
        delta: -0.9,
        tone: "red",
        spark: [34, 36, 32, 30, 28, 27, 25, 23],
      },
    ],
    series: [51, 54, 57, 59, 64, 67, 70, 74, 77, 82, 86, 91],
    channels: [
      ["Expansion", 42, 89800, 22.4],
      ["New business", 31, 66300, 13.2],
      ["Self serve", 18, 38500, 8.9],
      ["Services", 9, 19400, 3.1],
    ],
    events: [
      ["11:12", "Enterprise renewal batch cleared"],
      ["10:40", "Expansion pipeline added three accounts"],
      ["09:30", "Self-serve annual plan mix rose 4.8 points"],
    ],
  },
  reliability: {
    alert: "Deploy frequency is high with steady latency and no open incident.",
    chartLabel: "Healthy requests",
    metrics: [
      {
        id: "uptime",
        label: "Uptime",
        mode: "percent",
        value: 99.97,
        delta: 0.04,
        tone: "green",
        spark: [78, 78, 79, 80, 80, 81, 82, 83],
      },
      {
        id: "p95",
        label: "P95 latency",
        mode: "ms",
        value: 94,
        delta: -12.6,
        tone: "blue",
        spark: [69, 64, 59, 55, 53, 49, 47, 44],
      },
      {
        id: "deploys",
        label: "Deploys",
        mode: "number",
        value: 68,
        delta: 7.5,
        tone: "amber",
        spark: [32, 38, 35, 43, 48, 51, 56, 62],
      },
      {
        id: "errors",
        label: "Error rate",
        mode: "percent",
        lowerIsBetter: true,
        value: 0.18,
        delta: -0.12,
        tone: "red",
        spark: [40, 35, 32, 29, 25, 21, 20, 18],
      },
    ],
    series: [74, 75, 78, 80, 81, 83, 82, 84, 86, 87, 89, 90],
    channels: [
      ["HTML routes", 45, 421000, 99.99],
      ["Fragments", 28, 262000, 99.98],
      ["Assets", 17, 159000, 99.97],
      ["API reads", 10, 93600, 99.94],
    ],
    events: [
      ["10:55", "Canary deploy completed in 46 seconds"],
      ["09:48", "Edge cache hit rate recovered to 96.2%"],
      ["08:35", "No active incidents across regions"],
    ],
  },
};

export const sectionForPath = (path = "/") => {
  const normalized = path.replace(/\/+$/, "") || "/";
  return SECTIONS.find((section) => section.path === normalized) ?? SECTIONS[0];
};

const byId = (items, id) => items.find((item) => item.id === id) ?? items[0];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNumber = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}k`;
  return Intl.NumberFormat("en-US").format(Math.round(value));
};

const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 10_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${Intl.NumberFormat("en-US").format(Math.round(value))}`;
};

const formatValue = (mode, value) => {
  if (mode === "currency") return formatCurrency(value);
  if (mode === "percent") {
    const precision = value >= 20 || value < 1 ? 1 : 2;
    return `${value.toFixed(precision)}%`;
  }
  if (mode === "ms") return `${Math.round(value)}ms`;
  if (mode === "months") return `${value.toFixed(1)}mo`;
  return formatNumber(value);
};

const metricValue = (metric, range, segment) => {
  if (metric.mode === "number" || metric.mode === "currency") {
    return metric.value * range.metricFactor * segment.metricFactor;
  }
  if (metric.mode === "months") {
    return clamp(metric.value - segment.scoreBias / 9 - range.deltaBias / 8, 2.5, 18);
  }
  if (metric.mode === "ms") {
    return clamp(metric.value - segment.scoreBias * 1.8 - range.deltaBias * 2, 35, 280);
  }
  const scoreBias = metric.lowerIsBetter ? -segment.scoreBias : segment.scoreBias;
  const max = metric.id === "uptime" ? 99.99 : metric.id === "nrr" ? 180 : 100;
  return clamp(metric.value + scoreBias + range.deltaBias / 3, 0.01, max);
};

const metricDelta = (metric, range, segment) =>
  Number((metric.delta + range.deltaBias + segment.deltaBias).toFixed(1));

const scaleSeries = (series, range, segment) =>
  series.map((value, index) => {
    const wave = index % 2 === 0 ? segment.scoreBias * 0.5 : -segment.scoreBias * 0.25;
    return clamp(Math.round(value * range.seriesFactor + wave), 12, 96);
  });

export const resolveDashboardState = ({
  range = "30d",
  section = "overview",
  segment = "all",
} = {}) => {
  const sectionDef = byId(SECTIONS, section);
  const rangeDef = byId(RANGES, range);
  const segmentDef = byId(SEGMENTS, segment);
  const source = DATA[sectionDef.id];

  return {
    alert: source.alert,
    channels: source.channels.map(([name, share, value, quality]) => ({
      name,
      quality: Number((quality + segmentDef.scoreBias / 5).toFixed(1)),
      share,
      value: Math.round(value * rangeDef.metricFactor * segmentDef.metricFactor),
    })),
    chartLabel: source.chartLabel,
    events: source.events,
    metrics: source.metrics.map((metric) => ({
      ...metric,
      delta: metricDelta(metric, rangeDef, segmentDef),
      displayValue: formatValue(metric.mode, metricValue(metric, rangeDef, segmentDef)),
      spark: scaleSeries(metric.spark, rangeDef, segmentDef),
    })),
    range: rangeDef,
    section: sectionDef,
    segment: segmentDef,
    series: scaleSeries(source.series, rangeDef, segmentDef),
  };
};

const toneLabel = (delta) => (delta >= 0 ? "up" : "down");

const signedDelta = (delta) => `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;

const pointsFor = (series) =>
  series
    .map((value, index) => {
      const x = Math.round((index / (series.length - 1)) * 280);
      const y = Math.round(112 - value);
      return `${x},${y}`;
    })
    .join(" ");

const renderRangeControls = (state) =>
  RANGES.map(
    (range) => `<button
      class="control"
      type="button"
      data-range="${escapeHtml(range.id)}"
      aria-pressed="${range.id === state.range.id ? "true" : "false"}"
    >${escapeHtml(range.label)}</button>`,
  ).join("");

const renderSegmentControls = (state) =>
  SEGMENTS.map(
    (segment) => `<button
      class="control wide"
      type="button"
      data-segment="${escapeHtml(segment.id)}"
      aria-pressed="${segment.id === state.segment.id ? "true" : "false"}"
    >${escapeHtml(segment.label)}</button>`,
  ).join("");

const renderSpark = (metric) => `<span class="spark" aria-hidden="true">
  ${metric.spark
    .map((value) => `<i style="height: ${value}%"></i>`)
    .join("")}
</span>`;

const renderMetric = (metric) => `<article class="metric-card tone-${escapeHtml(metric.tone)}">
  <div>
    <p>${escapeHtml(metric.label)}</p>
    <strong>${escapeHtml(metric.displayValue)}</strong>
  </div>
  ${renderSpark(metric)}
  <span class="delta ${metric.delta >= 0 ? "positive" : "negative"}">
    ${escapeHtml(signedDelta(metric.delta))} ${escapeHtml(toneLabel(metric.delta))}
  </span>
</article>`;

const renderChart = (state) => `<section class="chart-panel" aria-label="${escapeHtml(
  state.chartLabel,
)}">
  <div class="panel-heading">
    <div>
      <p>Trend</p>
      <h2>${escapeHtml(state.chartLabel)}</h2>
    </div>
    <span>${escapeHtml(state.range.label)} / ${escapeHtml(state.segment.label)}</span>
  </div>
  <svg viewBox="0 0 280 126" role="img" aria-label="${escapeHtml(
    state.chartLabel,
  )} trend line">
    <path class="grid-line" d="M0 28H280M0 64H280M0 100H280"></path>
    <polyline points="${pointsFor(state.series)}"></polyline>
  </svg>
  <div class="chart-bars" aria-hidden="true">
    ${state.series
      .map((value) => `<i style="height: ${value}%"></i>`)
      .join("")}
  </div>
</section>`;

const renderChannels = (state) => `<section class="table-panel">
  <div class="panel-heading">
    <div>
      <p>Mix</p>
      <h2>Primary channels</h2>
    </div>
    <span>Quality indexed</span>
  </div>
  <div class="channel-table" role="table" aria-label="Primary channel performance">
    ${state.channels
      .map(
        (channel) => `<div class="channel-row" role="row">
          <span role="cell">${escapeHtml(channel.name)}</span>
          <span role="cell">${escapeHtml(formatNumber(channel.value))}</span>
          <span role="cell">${escapeHtml(channel.share)}%</span>
          <span role="cell">${escapeHtml(channel.quality.toFixed(1))}</span>
        </div>`,
      )
      .join("")}
  </div>
</section>`;

const renderEvents = (state) => `<section class="event-panel">
  <div class="panel-heading">
    <div>
      <p>Signals</p>
      <h2>Live annotations</h2>
    </div>
  </div>
  <ol>
    ${state.events
      .map(
        ([time, text]) => `<li>
          <time>${escapeHtml(time)}</time>
          <span>${escapeHtml(text)}</span>
        </li>`,
      )
      .join("")}
  </ol>
</section>`;

export const renderAnalyticsBoard = (input = {}) => {
  const state = input.metrics ? input : resolveDashboardState(input);

  return `<section class="board" data-board-section="${escapeHtml(state.section.id)}">
    <header class="board-header">
      <div>
        <p class="board-kicker">${escapeHtml(state.section.navLabel)} / Native Fragments</p>
        <h2>${escapeHtml(state.section.title)}</h2>
        <p>${escapeHtml(state.section.summary)}</p>
      </div>
      <div class="status">
        <span></span>
        Live edge render
      </div>
    </header>

    <section class="controls" aria-label="Dashboard controls">
      <div class="control-group" aria-label="Date range">
        ${renderRangeControls(state)}
      </div>
      <div class="control-group segments" aria-label="Audience segment">
        ${renderSegmentControls(state)}
      </div>
    </section>

    <section class="notice">
      <strong>Readout</strong>
      <span>${escapeHtml(state.alert)}</span>
    </section>

    <section class="metrics" aria-label="Key metrics">
      ${state.metrics.map(renderMetric).join("")}
    </section>

    <section class="lower-grid">
      ${renderChart(state)}
      ${renderChannels(state)}
      ${renderEvents(state)}
    </section>
  </section>`;
};

export const analyticsBoardStyles = `
  :host {
    display: block;
  }

  * {
    box-sizing: border-box;
  }

  .board {
    background: #fbf7ed;
    border: 1px solid #d8cfc0;
    border-radius: 8px;
    box-shadow: 0 24px 70px rgba(43, 35, 22, 0.12);
    color: #171511;
    min-height: 720px;
    overflow: hidden;
    padding: 24px;
  }

  .board-header,
  .controls,
  .notice,
  .metrics,
  .lower-grid,
  .panel-heading,
  .channel-row,
  .event-panel li {
    display: grid;
  }

  .board-header {
    align-items: start;
    gap: 20px;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .board-kicker,
  .panel-heading p,
  .metric-card p,
  .status,
  .delta,
  .notice strong,
  .event-panel time,
  .channel-row span:not(:first-child) {
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  }

  .board-kicker,
  .panel-heading p,
  .metric-card p {
    color: #716957;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0;
    margin: 0 0 6px;
    text-transform: uppercase;
  }

  h2,
  p {
    margin: 0;
  }

  .board-header h2 {
    color: #171511;
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
    font-size: 2.3rem;
    font-weight: 740;
    letter-spacing: 0;
    line-height: 0.98;
    max-width: 780px;
  }

  .board-header p:last-child {
    color: #4e493f;
    font-size: 1rem;
    line-height: 1.65;
    margin-top: 12px;
    max-width: 760px;
  }

  .status {
    align-items: center;
    background: #171511;
    border: 1px solid #302b22;
    border-radius: 8px;
    color: #fbf7ed;
    font-size: 0.75rem;
    gap: 8px;
    grid-template-columns: auto 1fr;
    padding: 10px 12px;
    white-space: nowrap;
  }

  .status span {
    background: #63b365;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(99, 179, 101, 0.18);
    height: 8px;
    width: 8px;
  }

  .controls {
    gap: 10px;
    grid-template-columns: auto minmax(0, 1fr);
    margin-top: 24px;
  }

  .control-group {
    background: #eee6d7;
    border: 1px solid #d7cbbb;
    border-radius: 8px;
    display: flex;
    gap: 4px;
    padding: 4px;
  }

  .segments {
    justify-self: end;
  }

  .control {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 6px;
    color: #4e493f;
    cursor: pointer;
    font: 700 0.82rem ui-sans-serif, system-ui, sans-serif;
    min-height: 34px;
    padding: 0 12px;
  }

  .control.wide {
    min-width: 98px;
  }

  .control[aria-pressed="true"] {
    background: #171511;
    color: #fbf7ed;
  }

  .control:focus-visible {
    outline: 2px solid #2f6f9f;
    outline-offset: 2px;
  }

  .notice {
    align-items: center;
    background: #eaf1ec;
    border: 1px solid #b8cdbc;
    border-radius: 8px;
    color: #243326;
    gap: 12px;
    grid-template-columns: auto 1fr;
    line-height: 1.5;
    margin-top: 18px;
    padding: 14px 16px;
  }

  .notice strong {
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .metrics {
    gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 18px;
  }

  .metric-card,
  .chart-panel,
  .table-panel,
  .event-panel {
    background: #fffaf1;
    border: 1px solid #d8cfc0;
    border-radius: 8px;
  }

  .metric-card {
    display: grid;
    gap: 14px;
    min-height: 168px;
    padding: 16px;
  }

  .metric-card strong {
    display: block;
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
    font-size: 2rem;
    font-weight: 760;
    line-height: 1;
  }

  .spark {
    align-items: end;
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(8, 1fr);
    height: 42px;
  }

  .spark i {
    background: #7b7568;
    border-radius: 3px 3px 0 0;
    display: block;
    min-height: 8px;
  }

  .tone-green .spark i,
  .positive {
    color: #286a39;
  }

  .tone-green .spark i {
    background: #63b365;
  }

  .tone-blue .spark i {
    background: #4380a6;
  }

  .tone-amber .spark i {
    background: #c18d32;
  }

  .tone-red .spark i,
  .negative {
    color: #9d3f3a;
  }

  .tone-red .spark i {
    background: #c85b52;
  }

  .delta {
    align-self: end;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .lower-grid {
    gap: 12px;
    grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.8fr);
    margin-top: 12px;
  }

  .chart-panel {
    min-height: 340px;
    padding: 18px;
  }

  .table-panel,
  .event-panel {
    padding: 18px;
  }

  .event-panel {
    grid-column: 2;
  }

  .panel-heading {
    align-items: start;
    gap: 12px;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-bottom: 18px;
  }

  .panel-heading h2 {
    font-size: 1.02rem;
    font-weight: 760;
  }

  .panel-heading span {
    color: #716957;
    font-size: 0.82rem;
  }

  svg {
    display: block;
    height: auto;
    width: 100%;
  }

  .grid-line {
    fill: none;
    stroke: #ded5c6;
    stroke-width: 1;
  }

  polyline {
    fill: none;
    stroke: #171511;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 4;
  }

  .chart-bars {
    align-items: end;
    border-top: 1px solid #e2d8c8;
    display: grid;
    gap: 7px;
    grid-template-columns: repeat(12, 1fr);
    height: 90px;
    margin-top: 20px;
    padding-top: 18px;
  }

  .chart-bars i {
    background: #d0a349;
    border-radius: 4px 4px 0 0;
    display: block;
    min-height: 12px;
  }

  .channel-table {
    display: grid;
    gap: 8px;
  }

  .channel-row {
    align-items: center;
    background: #f4eddf;
    border: 1px solid #e3d8c7;
    border-radius: 8px;
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) 72px 52px 52px;
    min-height: 44px;
    padding: 0 12px;
  }

  .channel-row span:first-child {
    font-weight: 720;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .channel-row span:not(:first-child) {
    color: #625b4d;
    font-size: 0.78rem;
    text-align: right;
  }

  .event-panel ol {
    display: grid;
    gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .event-panel li {
    align-items: start;
    background: #f4eddf;
    border: 1px solid #e3d8c7;
    border-radius: 8px;
    gap: 12px;
    grid-template-columns: 46px 1fr;
    padding: 12px;
  }

  .event-panel time {
    color: #716957;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .event-panel span {
    color: #302b22;
    line-height: 1.45;
  }

  @media (max-width: 1120px) {
    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lower-grid {
      grid-template-columns: 1fr;
    }

    .event-panel {
      grid-column: auto;
    }
  }

  @media (max-width: 760px) {
    .board {
      border-radius: 0;
      min-height: 0;
      padding: 16px;
    }

    .board-header,
    .controls,
    .metrics,
    .panel-heading {
      grid-template-columns: 1fr;
    }

    .board-header h2 {
      font-size: 1.8rem;
    }

    .status,
    .segments {
      justify-self: start;
    }

    .control-group {
      flex-wrap: wrap;
    }

    .metric-card strong {
      font-size: 1.72rem;
    }
  }

  @media (max-width: 520px) {
    .metrics {
      grid-template-columns: 1fr;
    }

    .channel-row {
      grid-template-columns: minmax(0, 1fr) 64px;
    }

    .channel-row span:nth-child(3),
    .channel-row span:nth-child(4) {
      display: none;
    }
  }
`;
