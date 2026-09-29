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

const signedDelta = (delta) => `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;

const CHART_W = 300;
const CHART_H = 120;
const CHART_PAD = 6;

const chartGeometry = (series) => {
  const max = Math.max(...series, 1);
  const min = Math.min(...series);
  const span = Math.max(max - min, 1);
  const innerW = CHART_W - CHART_PAD * 2;
  const innerH = CHART_H - CHART_PAD * 2;
  const coords = series.map((value, index) => {
    const x = CHART_PAD + (index / (series.length - 1)) * innerW;
    const y = CHART_PAD + (1 - (value - min) / span) * innerH;
    return [Number(x.toFixed(1)), Number(y.toFixed(1))];
  });
  return { coords, max, min };
};

const linePath = (coords) =>
  coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

const areaPath = (coords) =>
  `${linePath(coords)} L${coords[coords.length - 1][0]} ${CHART_H - CHART_PAD} L${coords[0][0]} ${CHART_H - CHART_PAD} Z`;

const ARROW_UP =
  '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 2.2 10 7H7.5v3.2h-3V7H2z"/></svg>';
const ARROW_DOWN =
  '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 9.8 2 5h2.5V1.8h3V5H10z"/></svg>';

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

const renderMetric = (metric) => {
  const positive = metric.delta >= 0;
  return `<article class="metric-card tone-${escapeHtml(metric.tone)}">
  <div class="metric-top">
    <p class="metric-label">${escapeHtml(metric.label)}</p>
    <span class="delta ${positive ? "positive" : "negative"}">
      ${positive ? ARROW_UP : ARROW_DOWN}<span>${escapeHtml(signedDelta(metric.delta))}</span>
    </span>
  </div>
  <strong class="metric-value">${escapeHtml(metric.displayValue)}</strong>
  ${renderSpark(metric)}
</article>`;
};

const renderChart = (state) => {
  const { coords, max, min } = chartGeometry(state.series);
  const last = state.series[state.series.length - 1];
  const first = state.series[0];
  const trend = last - first;
  const trendUp = trend >= 0;
  const dot = coords[coords.length - 1];
  return `<section class="chart-panel" aria-label="${escapeHtml(state.chartLabel)}">
  <div class="panel-heading">
    <div>
      <p>Trend</p>
      <h2>${escapeHtml(state.chartLabel)}</h2>
    </div>
    <span class="chart-range">${escapeHtml(state.range.label)} · ${escapeHtml(state.segment.label)}</span>
  </div>
  <div class="chart-figures">
    <span class="chart-now">${escapeHtml(String(Math.round(last)))}<small>index</small></span>
    <span class="chart-trend ${trendUp ? "positive" : "negative"}">${trendUp ? ARROW_UP : ARROW_DOWN}<span>${escapeHtml(`${trendUp ? "+" : ""}${Math.round(trend)} pts`)}</span></span>
  </div>
  <div class="chart-plot">
    <svg viewBox="0 0 ${CHART_W} ${CHART_H}" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(state.chartLabel)} trend over ${escapeHtml(state.range.label)}">
      <defs>
        <linearGradient id="${escapeHtml(`fill-${state.section.id}`)}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#171511" stop-opacity="0.14"></stop>
          <stop offset="100%" stop-color="#171511" stop-opacity="0"></stop>
        </linearGradient>
      </defs>
      <path class="grid-line" d="M${CHART_PAD} ${CHART_PAD + (CHART_H - CHART_PAD * 2) * 0.25}H${CHART_W - CHART_PAD}M${CHART_PAD} ${CHART_PAD + (CHART_H - CHART_PAD * 2) * 0.5}H${CHART_W - CHART_PAD}M${CHART_PAD} ${CHART_PAD + (CHART_H - CHART_PAD * 2) * 0.75}H${CHART_W - CHART_PAD}"></path>
      <path class="chart-area" d="${areaPath(coords)}" fill="url(#${escapeHtml(`fill-${state.section.id}`)})"></path>
      <path class="chart-line" d="${linePath(coords)}"></path>
      <circle class="chart-dot" cx="${dot[0]}" cy="${dot[1]}" r="3.4"></circle>
    </svg>
    <span class="chart-axis chart-axis-high">${escapeHtml(String(Math.round(max)))}</span>
    <span class="chart-axis chart-axis-low">${escapeHtml(String(Math.round(min)))}</span>
  </div>
</section>`;
};

const renderChannels = (state) => {
  const maxQuality = Math.max(...state.channels.map((c) => c.quality), 1);
  return `<section class="table-panel">
  <div class="panel-heading">
    <div>
      <p>Mix</p>
      <h2>Primary channels</h2>
    </div>
    <span>Quality indexed</span>
  </div>
  <div class="channel-table" role="table" aria-label="Primary channel performance">
    <div class="channel-row channel-head" role="row">
      <span role="columnheader">Channel</span>
      <span role="columnheader">Sessions</span>
      <span role="columnheader">Share</span>
      <span role="columnheader">Quality</span>
    </div>
    ${state.channels
      .map(
        (channel) => `<div class="channel-row" role="row">
          <span class="channel-name" role="cell">${escapeHtml(channel.name)}</span>
          <span class="channel-num" role="cell">${escapeHtml(formatNumber(channel.value))}</span>
          <span class="channel-num" role="cell">${escapeHtml(channel.share)}%</span>
          <span class="channel-quality" role="cell">
            <span class="quality-bar" aria-hidden="true"><i style="width: ${Math.round((channel.quality / maxQuality) * 100)}%"></i></span>
            <span class="quality-val">${escapeHtml(channel.quality.toFixed(1))}</span>
          </span>
        </div>`,
      )
      .join("")}
  </div>
</section>`;
};

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
        <p class="board-kicker">${escapeHtml(state.section.kicker)} · ${escapeHtml(state.section.navLabel)}</p>
        <h2>${escapeHtml(state.section.title)}</h2>
        <p class="board-summary">${escapeHtml(state.section.summary)}</p>
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
    --ink: #1a1712;
    --ink-soft: #534c3f;
    --muted: #7a7160;
    --paper: #fbf7ed;
    --card: #fffaf1;
    --line: #ddd2c0;
    --line-soft: #e7dccb;
    --inset: #f4ecdd;
    --amber: #c08a2c;
    --pos: #2c6a3a;
    --neg: #9a3b34;
  }

  * {
    box-sizing: border-box;
  }

  .board {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 1px 0 #fff inset, 0 18px 50px rgba(43, 35, 22, 0.1);
    color: var(--ink);
    overflow: hidden;
    padding: 22px;
  }

  .board-header,
  .metrics,
  .lower-grid,
  .panel-heading,
  .channel-row,
  .event-panel li {
    display: grid;
  }

  .board-header {
    align-items: center;
    border-bottom: 1px solid var(--line-soft);
    gap: 20px 24px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding-bottom: 20px;
  }

  .board-kicker,
  .panel-heading p,
  .metric-label,
  .status,
  .delta,
  .chart-trend,
  .chart-now small,
  .chart-axis,
  .notice strong,
  .channel-head span,
  .channel-num,
  .quality-val,
  .event-panel time {
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  }

  .board-kicker,
  .panel-heading p,
  .metric-label,
  .channel-head span,
  .notice strong {
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    margin: 0;
    text-transform: uppercase;
  }

  .board-kicker {
    margin-bottom: 8px;
  }

  h2,
  p {
    margin: 0;
  }

  .board-header h2 {
    color: var(--ink);
    font-family: "Iowan Old Style", ui-serif, Georgia, Cambria, "Times New Roman", serif;
    font-size: 2.05rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1;
    max-width: 720px;
  }

  .board-header p.board-summary {
    color: var(--ink-soft);
    font-size: 0.95rem;
    line-height: 1.55;
    margin-top: 10px;
    max-width: 60ch;
  }

  .status {
    align-items: center;
    align-self: start;
    background: var(--ink);
    border-radius: 999px;
    color: var(--paper);
    display: inline-flex;
    font-size: 0.7rem;
    font-weight: 600;
    gap: 8px;
    letter-spacing: 0.04em;
    padding: 7px 14px 7px 11px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .status span {
    background: #63b365;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(99, 179, 101, 0.2);
    height: 7px;
    width: 7px;
  }

  .controls {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-top: 20px;
  }

  .control-group {
    background: var(--inset);
    border: 1px solid var(--line-soft);
    border-radius: 8px;
    display: inline-flex;
    gap: 2px;
    padding: 3px;
  }

  .segments {
    margin-left: auto;
  }

  .control {
    appearance: none;
    background: transparent;
    border: 0;
    border-radius: 6px;
    color: var(--ink-soft);
    cursor: pointer;
    font: 600 0.8rem ui-sans-serif, system-ui, sans-serif;
    min-height: 32px;
    padding: 0 13px;
    transition: background 0.12s ease, color 0.12s ease;
  }

  .control:hover {
    color: var(--ink);
  }

  .control.wide {
    min-width: 92px;
  }

  .control[aria-pressed="true"] {
    background: var(--ink);
    box-shadow: 0 1px 2px rgba(26, 23, 18, 0.25);
    color: var(--paper);
  }

  .control:focus-visible {
    outline: 2px solid #2f6f9f;
    outline-offset: 2px;
  }

  .notice {
    align-items: baseline;
    background: linear-gradient(180deg, #eef3ed, #e8efe9);
    border: 1px solid #c4d6c7;
    border-left: 3px solid #5f9a6c;
    border-radius: 8px;
    color: #233825;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    line-height: 1.45;
    margin-top: 16px;
    padding: 12px 16px;
  }

  .notice strong {
    color: #3c6346;
  }

  .notice span {
    font-size: 0.92rem;
  }

  .metrics {
    gap: 12px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 16px;
  }

  .metric-card,
  .chart-panel,
  .table-panel,
  .event-panel {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 10px;
  }

  .metric-card {
    border-top: 2px solid var(--metric-accent, #b9ad97);
    display: grid;
    gap: 14px;
    grid-template-rows: auto auto 1fr;
    min-height: 150px;
    padding: 14px 15px 15px;
  }

  .tone-green { --metric-accent: #5f9c63; }
  .tone-blue { --metric-accent: #3f7ba1; }
  .tone-amber { --metric-accent: #c08a2c; }
  .tone-red { --metric-accent: #c0564d; }

  .metric-top {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }

  .metric-value {
    display: block;
    font-family: "Iowan Old Style", ui-serif, Georgia, Cambria, "Times New Roman", serif;
    font-size: 1.95rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 0.95;
  }

  .delta,
  .chart-trend {
    align-items: center;
    border-radius: 999px;
    display: inline-flex;
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    gap: 3px;
    padding: 2px 7px 2px 5px;
  }

  .delta svg,
  .chart-trend svg {
    height: 11px;
    width: 11px;
  }

  .positive {
    background: rgba(44, 106, 58, 0.1);
    color: var(--pos);
  }

  .positive svg { fill: var(--pos); }

  .negative {
    background: rgba(154, 59, 52, 0.1);
    color: var(--neg);
  }

  .negative svg { fill: var(--neg); }

  .spark {
    align-items: end;
    align-self: end;
    display: grid;
    gap: 3px;
    grid-template-columns: repeat(8, 1fr);
    height: 38px;
  }

  .spark i {
    background: var(--spark, #b3a890);
    border-radius: 2px 2px 0 0;
    display: block;
    min-height: 4px;
    opacity: 0.55;
  }

  .spark i:last-child { opacity: 1; }

  .tone-green .spark i { --spark: #5f9c63; }
  .tone-blue .spark i { --spark: #3f7ba1; }
  .tone-amber .spark i { --spark: #c08a2c; }
  .tone-red .spark i { --spark: #c0564d; }

  .lower-grid {
    gap: 12px;
    grid-template-columns: minmax(0, 1.4fr) minmax(290px, 0.92fr);
    grid-template-rows: auto auto;
    margin-top: 12px;
  }

  .chart-panel {
    grid-row: span 2;
    padding: 18px;
  }

  .table-panel,
  .event-panel {
    padding: 18px;
  }

  .panel-heading {
    align-items: baseline;
    gap: 8px 12px;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-bottom: 16px;
  }

  .panel-heading p {
    margin-bottom: 5px;
  }

  .panel-heading h2 {
    font-family: "Iowan Old Style", ui-serif, Georgia, Cambria, serif;
    font-size: 1.12rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .panel-heading span {
    color: var(--muted);
    font-size: 0.78rem;
  }

  .chart-range {
    font-family: ui-monospace, Menlo, monospace;
    letter-spacing: 0.02em;
  }

  .chart-figures {
    align-items: baseline;
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
  }

  .chart-now {
    font-family: "Iowan Old Style", ui-serif, Georgia, serif;
    font-size: 1.7rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1;
  }

  .chart-now small {
    color: var(--muted);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    margin-left: 6px;
    text-transform: uppercase;
  }

  .chart-plot {
    position: relative;
  }

  .chart-plot svg {
    display: block;
    height: 168px;
    width: 100%;
  }

  .grid-line {
    fill: none;
    stroke: #e3d8c7;
    stroke-dasharray: 2 4;
    stroke-width: 1;
  }

  .chart-line {
    fill: none;
    stroke: var(--ink);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .chart-dot {
    fill: var(--paper);
    stroke: var(--ink);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .chart-axis {
    color: var(--muted);
    font-size: 0.66rem;
    font-variant-numeric: tabular-nums;
    position: absolute;
    right: 2px;
  }

  .chart-axis-high { top: 0; }
  .chart-axis-low { bottom: 0; }

  .channel-table {
    display: grid;
    gap: 2px;
  }

  .channel-row {
    align-items: center;
    column-gap: 10px;
    grid-template-columns: minmax(0, 1fr) 58px 42px 78px;
    min-height: 38px;
    padding: 7px 2px;
  }

  .channel-row:not(.channel-head) {
    border-top: 1px solid var(--line-soft);
  }

  .channel-head span {
    font-size: 0.64rem;
  }

  .channel-head span:not(.channel-name) {
    text-align: right;
  }

  .channel-name {
    font-weight: 600;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .channel-num {
    color: var(--ink-soft);
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .channel-quality {
    align-items: center;
    display: grid;
    gap: 7px;
    grid-template-columns: 1fr auto;
  }

  .quality-bar {
    background: var(--inset);
    border-radius: 999px;
    height: 5px;
    overflow: hidden;
  }

  .quality-bar i {
    background: var(--amber);
    border-radius: 999px;
    display: block;
    height: 100%;
    min-width: 4px;
  }

  .quality-val {
    color: var(--ink);
    font-size: 0.78rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    text-align: right;
    width: 30px;
  }

  .event-panel ol {
    display: grid;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .event-panel li {
    align-items: start;
    gap: 12px;
    grid-template-columns: 44px 1fr;
    padding: 11px 0;
  }

  .event-panel li + li {
    border-top: 1px solid var(--line-soft);
  }

  .event-panel time {
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 600;
    padding-top: 1px;
  }

  .event-panel li span {
    color: var(--ink-soft);
    font-size: 0.88rem;
    line-height: 1.4;
  }

  @media (max-width: 1120px) {
    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lower-grid {
      grid-template-columns: 1fr;
    }

    .chart-panel {
      grid-row: auto;
    }
  }

  @media (max-width: 760px) {
    .board {
      border-radius: 0;
      border-left: 0;
      border-right: 0;
      padding: 16px;
    }

    .board-header {
      grid-template-columns: 1fr;
    }

    .board-header h2 {
      font-size: 1.7rem;
    }

    .segments {
      margin-left: 0;
    }

    .metric-value {
      font-size: 1.78rem;
    }
  }

  @media (max-width: 520px) {
    .metrics {
      grid-template-columns: 1fr;
    }

    .control-group {
      flex: 1 1 100%;
    }

    .control {
      flex: 1;
    }

    .channel-row {
      grid-template-columns: minmax(0, 1fr) 60px 78px;
    }

    .channel-head span:nth-child(3),
    .channel-row span:nth-child(3):not(.channel-quality) {
      display: none;
    }
  }
`;
