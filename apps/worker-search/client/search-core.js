export const normalizeQuery = (value) =>
  String(value ?? "").trim().toLowerCase();

export const searchableText = (record) =>
  [
    record.id,
    record.name,
    record.title,
    record.recclass,
    record.classGroup,
    record.fall,
    record.year,
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
  const name = record.name.toLowerCase();
  const recclass = record.recclass.toLowerCase();
  const tags = record.tags.join(" ").toLowerCase();
  const haystack = searchableText(record);

  let rank = record.score;
  if (name === query) rank += 120;
  if (title.startsWith(query)) rank += 80;
  if (title.includes(query)) rank += 45;
  if (recclass === query) rank += 42;
  if (recclass.includes(query)) rank += 34;
  if (tags.includes(query)) rank += 30;
  if (haystack.includes(query)) rank += 10;
  return rank;
};

const compareText = (left, right, field) =>
  String(left[field] ?? "").localeCompare(String(right[field] ?? ""));

const compareNumber = (left, right, field) =>
  (right[field] ?? Number.NEGATIVE_INFINITY) -
  (left[field] ?? Number.NEGATIVE_INFINITY);

export const sortRows = (rankedRows, sort = "relevance") => {
  const rows = [...rankedRows];

  if (sort === "mass") {
    return rows.sort((left, right) =>
      compareNumber(left.row, right.row, "mass") ||
      right.rank - left.rank ||
      compareText(left.row, right.row, "name"),
    );
  }

  if (sort === "year") {
    return rows.sort((left, right) =>
      compareNumber(left.row, right.row, "year") ||
      right.rank - left.rank ||
      compareText(left.row, right.row, "name"),
    );
  }

  if (sort === "name") {
    return rows.sort((left, right) => compareText(left.row, right.row, "name"));
  }

  if (sort === "class") {
    return rows.sort((left, right) =>
      compareText(left.row, right.row, "recclass") ||
      compareText(left.row, right.row, "name"),
    );
  }

  return rows.sort((left, right) =>
    right.rank - left.rank || compareText(left.row, right.row, "name"),
  );
};

export const filterRows = ({ rows = [], query = "", limit = 24, sort = "relevance" } = {}) => {
  const needle = normalizeQuery(query);
  const matched = needle
    ? rows.filter((row) => searchableText(row).includes(needle))
    : rows;

  const rankedRows = matched
    .map((row) => ({ row, rank: rankRecord(row, needle) }))
  const results = sortRows(rankedRows, sort)
    .slice(0, limit)
    .map(({ row }) => row);

  return {
    query: needle,
    results,
    sort,
    total: matched.length,
  };
};
