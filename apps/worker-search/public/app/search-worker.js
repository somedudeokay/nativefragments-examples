import { exposeWorker } from "/nativefragments/worker.js";
import { filterRows } from "./search-core.js";

let rowsPromise;

const loadRows = (dataUrl = "/app/data/meteorites.json") => {
  rowsPromise ??= fetch(dataUrl).then((response) => {
    if (!response.ok) throw new Error(`Could not load meteorite data: ${response.status}`);
    return response.json();
  });

  return rowsPromise;
};

exposeWorker({
  async filter({ dataUrl, query, limit = 32, sort = "relevance" }) {
    const start = performance.now();
    const rows = await loadRows(dataUrl);
    const result = filterRows({ rows, query, limit, sort });
    const duration = performance.now() - start;

    return {
      ...result,
      duration,
    };
  },
});
