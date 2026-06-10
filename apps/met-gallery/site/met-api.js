const apiBase = "https://api.artic.edu/api/v1";
const iiifBase = "https://www.artic.edu/iiif/2";

const collections = {
  painting: {
    accent: "Paintings",
    label: "Paintings",
    type: "Painting",
    scope: "oil, acrylic, and tempera works across the painting collection",
  },
  sculpture: {
    accent: "Sculpture",
    label: "Sculpture",
    type: "Sculpture",
    scope: "carved, cast, and modeled works in the round and in relief",
  },
  photograph: {
    accent: "Photography",
    label: "Photographs",
    type: "Photograph",
    scope: "prints and negatives spanning the history of the photographic image",
  },
  textile: {
    accent: "Textiles",
    label: "Textiles",
    type: "Textile",
    scope: "woven, embroidered, and dyed works from the textile collection",
  },
};

export const topics = Object.entries(collections).map(([id, item]) => ({
  id,
  accent: item.accent,
  label: item.label,
  scope: item.scope,
}));

export const topicForUrl = (url) => {
  const requested = url.searchParams.get("topic") || "painting";
  return collections[requested] ? requested : "painting";
};

export const collectionForTopic = (topic) => collections[topic] ?? collections.painting;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Minimum latency floor for a fragment, so the demo cascade stays visible even
 * when the upstream API is fast. `?fast=1` collapses every floor to zero.
 */
const floorDelay = (url, ms) => delay(url.searchParams.has("fast") ? 0 : ms);

const userAgent = "NativeFragmentsStreamingDemo/0.1 (nativefragments.org)";

const fetchJson = async (url, { signal } = {}) => {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Art Institute API request failed: ${response.status}`);
  return response.json();
};

const compact = (value, fallback = "Unknown") => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text || fallback;
};

const stripHtml = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value, max) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

/**
 * Structured Elasticsearch query — required for an ACCURATE per-type total
 * (the plain `q=` search always reports the collection-wide count).
 */
const searchUrl = (type, { fields, limit }) =>
  `${apiBase}/artworks/search` +
  `?query%5Bmatch%5D%5Bartwork_type_title%5D=${encodeURIComponent(type)}` +
  `&fields=${fields}&limit=${limit}`;

const imageUrl = (imageId, width = 843) =>
  `${iiifBase}/${imageId}/full/${width},/0/default.jpg`;

const artworkUrl = (id) => `https://www.artic.edu/artworks/${id}`;

/**
 * Fast fragment: one structured search; the accurate total comes from
 * `pagination.total`, the rest are honest ratios over the sampled page.
 */
export const loadCollectionStats = async (url, { signal } = {}) => {
  const topic = topicForUrl(url);
  const collection = collectionForTopic(topic);

  const floor = floorDelay(url, 250);
  const data = await fetchJson(
    searchUrl(collection.type, { fields: "id,image_id,is_on_view", limit: 100 }),
    { signal },
  );
  await floor;

  const items = data.data ?? [];
  return {
    accent: collection.accent,
    onView: items.filter((item) => item.is_on_view).length,
    sample: items.length,
    total: data.pagination?.total ?? items.length,
    withImages: items.filter((item) => item.image_id).length,
  };
};

/**
 * Medium fragment: a structured search to find an image-bearing work, then one
 * detail fetch for a rich, editorial blurb.
 */
export const loadFeaturedObject = async (url, { signal } = {}) => {
  const topic = topicForUrl(url);
  const collection = collectionForTopic(topic);

  const floor = floorDelay(url, 650);
  const search = await fetchJson(
    searchUrl(collection.type, { fields: "id,image_id", limit: 25 }),
    { signal },
  );
  const candidate = (search.data ?? []).find((item) => item.image_id);
  if (!candidate) throw new Error("No featured artwork found");

  const detail = await fetchJson(
    `${apiBase}/artworks/${candidate.id}?fields=id,title,artist_display,date_display,medium_display,image_id,department_title,description`,
    { signal },
  );
  await floor;

  const art = detail.data ?? {};
  return {
    artist: compact(art.artist_display, "Unknown maker"),
    date: compact(art.date_display, "Date unknown"),
    department: compact(art.department_title, "Art Institute of Chicago"),
    description: truncate(stripHtml(art.description), 220),
    image: imageUrl(art.image_id, 843),
    medium: compact(art.medium_display, "Medium not listed"),
    objectUrl: artworkUrl(art.id),
    title: compact(art.title, "Untitled"),
  };
};

/**
 * Error fragment: deliberately fails to demonstrate that one broken region
 * streams an error boundary while every other fragment still resolves.
 */
export const loadProvenance = async (url) => {
  await floorDelay(url, 400);
  throw new Error("Provenance service unavailable (intentional demo failure).");
};

/**
 * Slow fragment: the full table of image-bearing works for the active type.
 */
export const loadArtworks = async (url, { signal } = {}) => {
  const topic = topicForUrl(url);
  const collection = collectionForTopic(topic);

  const minimumLatency = floorDelay(url, 1150);
  const data = await fetchJson(
    searchUrl(collection.type, {
      fields: "id,title,artist_display,date_display,medium_display,image_id",
      limit: 30,
    }),
    { signal },
  );
  await minimumLatency;

  const rows = (data.data ?? [])
    .filter((item) => item.image_id && item.title)
    .slice(0, 8)
    .map((item) => ({
      artist: compact(item.artist_display, "Unknown maker"),
      date: compact(item.date_display, "Date unknown"),
      medium: compact(item.medium_display, "Medium not listed"),
      objectUrl: artworkUrl(item.id),
      title: compact(item.title, "Untitled"),
    }));

  if (rows.length === 0) throw new Error("No table-ready artworks found");

  return {
    label: collection.label,
    rows,
    total: data.pagination?.total ?? rows.length,
  };
};
