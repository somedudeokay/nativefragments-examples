import { shadow, sheet } from "/nativefragments/component.js";
import { createWorkerClient } from "/nativefragments/worker.js";
import {
  renderRows,
  renderSearchApp,
  workerSearchStyles,
} from "./worker-search-app-template.js";

const styles = sheet(workerSearchStyles);

const readState = (element) => {
  const script = element.querySelector("script[data-search-state]");
  if (!script?.textContent) return { rows: [], stats: { records: 0, categories: 0, regions: 0 } };

  return JSON.parse(script.textContent);
};

const statusText = ({ duration, query, rendered, total }) => {
  const label = query ? `"${query}"` : "all records";
  return `${total} matching ${label}; showing ${rendered} rows after ${duration.toFixed(1)}ms in a Worker.`;
};

class WorkerSearchApp extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;

    this.abortController = new AbortController();
    this.state = readState(this);
    this.searchWorker = createWorkerClient("/app/search-worker.js", {
      timeout: 10_000,
    });

    this.root = shadow(this, {
      styles: [styles],
      html: renderSearchApp({
        rows: this.state.rows.slice(0, 12),
        stats: this.state.stats,
      }),
    });

    this.input = this.root.querySelector("[data-search-input]");
    this.results = this.root.querySelector("[data-search-results]");
    this.status = this.root.querySelector("[data-search-status]");
    this.latestRequest = 0;

    this.input?.addEventListener(
      "input",
      () => {
        window.clearTimeout(this.searchTimer);
        this.searchTimer = window.setTimeout(() => {
          this.search(this.input.value);
        }, 90);
      },
      { signal: this.abortController.signal },
    );
  }

  disconnectedCallback() {
    window.clearTimeout(this.searchTimer);
    this.abortController?.abort();
    this.abortController = null;
    this.searchWorker?.dispose();
    this.searchWorker = null;
  }

  async search(query) {
    const requestId = ++this.latestRequest;
    const cleanQuery = query.trim();

    if (this.status) {
      this.status.textContent = cleanQuery
        ? `Filtering "${cleanQuery}" in a dedicated Worker...`
        : "Restoring the ranked server dataset in a dedicated Worker...";
    }

    try {
      const result = await this.searchWorker.call("filter", {
        limit: 32,
        query: cleanQuery,
        rows: this.state.rows,
      });

      if (requestId !== this.latestRequest) return;

      this.results.innerHTML = renderRows(result.results);
      this.status.textContent = statusText({
        duration: result.duration,
        query: cleanQuery,
        rendered: result.results.length,
        total: result.total,
      });
    } catch (error) {
      if (requestId !== this.latestRequest || !this.status) return;
      this.status.textContent = error?.message ?? "Worker search failed.";
    }
  }
}

customElements.define("worker-search-app", WorkerSearchApp);
