import { exposeWorker } from "/nativefragments/worker.js";
import { filterRows } from "./search-core.js";

exposeWorker({
  filter({ rows, query, limit = 32 }) {
    const start = performance.now();
    const result = filterRows({ rows, query, limit });
    const duration = performance.now() - start;

    return {
      ...result,
      duration,
    };
  },
});
