const domains = [
  "routing",
  "analytics",
  "commerce",
  "support",
  "publishing",
  "identity",
  "observability",
  "finance",
  "inventory",
  "research",
];

const regions = [
  "Oslo",
  "Tokyo",
  "Toronto",
  "Berlin",
  "Nairobi",
  "Sao Paulo",
  "Lisbon",
  "Seoul",
  "Austin",
  "Auckland",
];

const actions = [
  "queue",
  "index",
  "stream",
  "sync",
  "score",
  "merge",
  "audit",
  "route",
  "cache",
  "trace",
];

const tags = [
  "edge",
  "worker",
  "search",
  "fragment",
  "shadow",
  "html",
  "zero-build",
  "rpc",
  "dataset",
  "filter",
];

const owners = [
  "Platform",
  "Growth",
  "Operations",
  "Docs",
  "Security",
  "Success",
  "Data",
  "Experience",
];

const pad = (value) => String(value).padStart(4, "0");

const createRecord = (index) => {
  const domain = domains[index % domains.length];
  const region = regions[(index * 3) % regions.length];
  const action = actions[(index * 7) % actions.length];
  const owner = owners[(index * 5) % owners.length];
  const primary = tags[index % tags.length];
  const secondary = tags[(index * 2 + 3) % tags.length];

  return {
    id: `wf-${pad(index + 1)}`,
    title: `${region} ${domain} ${action}`,
    owner,
    region,
    category: domain,
    score: 42 + ((index * 17) % 58),
    tags: [primary, secondary],
    summary: `Entry ${pad(index + 1)} models ${domain} ${action} work for ${owner.toLowerCase()} teams at the edge.`,
  };
};

export const records = Array.from({ length: 2400 }, (_, index) =>
  createRecord(index),
);
