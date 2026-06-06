export const filters = ["all", "deploys", "incidents", "comments"];

export const events = [
  {
    id: "evt-1088",
    kind: "deploys",
    actor: "ci-bot",
    action: "deployed",
    title: "Edge dashboard deployed",
    detail: "Rolled out to 12 regions with zero failed checks.",
    age: "2 min",
  },
  {
    id: "evt-1087",
    kind: "comments",
    actor: "Priya N.",
    action: "closed review on",
    title: "Design review closed",
    detail: "The examples catalog moved to full-width screenshot rows.",
    age: "8 min",
  },
  {
    id: "evt-1086",
    kind: "incidents",
    actor: "on-call",
    action: "resolved",
    title: "Cache miss spike resolved",
    detail: "Static assets returned to the expected edge hit ratio.",
    age: "14 min",
  },
  {
    id: "evt-1085",
    kind: "deploys",
    actor: "ci-bot",
    action: "promoted",
    title: "Worker search promoted",
    detail: "Filtering now runs in a browser Worker through the helper RPC.",
    age: "22 min",
  },
  {
    id: "evt-1084",
    kind: "comments",
    actor: "Sam O.",
    action: "attached a note to",
    title: "QA note attached",
    detail: "Node tests cover the pure feed filtering model.",
    age: "31 min",
  },
];

export const normalizeFilter = (filter) =>
  filters.includes(filter) ? filter : "all";

export const filterEvents = (filter = "all") => {
  const normalized = normalizeFilter(filter);
  return normalized === "all"
    ? events
    : events.filter((event) => event.kind === normalized);
};

export const filterCounts = () =>
  filters.reduce((counts, filter) => {
    counts[filter] = filterEvents(filter).length;
    return counts;
  }, {});

export const feedSummary = (filter = "all") => ({
  filter: normalizeFilter(filter),
  total: filterEvents(filter).length,
  newest: filterEvents(filter)[0]?.id ?? null,
});
