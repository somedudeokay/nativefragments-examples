export const normalizeQuery = (value) =>
  String(value ?? "").trim().toLowerCase();

export const searchableText = (record) =>
  [
    record.id,
    record.title,
    record.owner,
    record.region,
    record.category,
    record.summary,
    ...(record.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

export const rankRecord = (record, query) => {
  if (!query) return record.score;

  const title = record.title.toLowerCase();
  const tags = record.tags.join(" ").toLowerCase();
  const haystack = searchableText(record);

  let rank = record.score;
  if (title.startsWith(query)) rank += 80;
  if (title.includes(query)) rank += 45;
  if (tags.includes(query)) rank += 30;
  if (haystack.includes(query)) rank += 10;
  return rank;
};

export const filterRows = ({ rows = [], query = "", limit = 24 } = {}) => {
  const needle = normalizeQuery(query);
  const matched = needle
    ? rows.filter((row) => searchableText(row).includes(needle))
    : rows;

  const results = matched
    .map((row) => ({ row, rank: rankRecord(row, needle) }))
    .sort((left, right) => right.rank - left.rank || left.row.id.localeCompare(right.row.id))
    .slice(0, limit)
    .map(({ row }) => row);

  return {
    query: needle,
    results,
    total: matched.length,
  };
};
