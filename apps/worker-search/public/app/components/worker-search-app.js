import { shadow, sheet } from "/nativefragments/component.js";
import { createWorkerClient } from "/nativefragments/worker.js";
import {
  renderHead,
  renderRows,
  renderSearchApp,
  workerSearchStyles,
} from "./worker-search-app-template.js";

const styles = sheet(workerSearchStyles);

const readState = (element) => {
  const script = element.querySelector("script[data-search-state]");
  if (!script?.textContent) {
    return {
      dataUrl: "/app/data/meteorites.json",
      initialRows: [],
      stats: { records: 0, categories: 0, regions: 0 },
    };
  }

  return JSON.parse(script.textContent);
};

const statusText = ({ duration, query, rendered, sort, total }) => {
  const label = query ? `for "${query}"` : "across all records";
  return `<b>${total.toLocaleString()}</b> matches ${label} · showing top <b>${rendered}</b> sorted by ${sort} · resolved in <b>${duration.toFixed(1)} ms</b> by a Worker`;
};

class WorkerSearchApp extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;

    this.abortController = new AbortController();
    this.state = readState(this);
    this.searchWorker = createWorkerClient("/app/search-worker.js", {
      timeout: 30_000,
    });

    this.root = shadow(this, {
      styles: [styles],
      html: renderSearchApp({
        rows: this.state.initialRows.slice(0, 12),
        stats: this.state.stats,
        sort: "mass",
      }),
    });

    this.input = this.root.querySelector("[data-search-input]");
    this.sortSelect = this.root.querySelector("[data-sort-select]");
    this.results = this.root.querySelector("[data-search-results]");
    this.head = this.root.querySelector("[data-search-head]");
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

    this.sortSelect?.addEventListener(
      "change",
      () => {
        this.search(this.input?.value ?? "");
      },
      { signal: this.abortController.signal },
    );

    // Clickable, sortable column headers stay in sync with the <select>.
    this.head?.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest("[data-sort-col]");
        if (!button) return;
        const sort = button.getAttribute("data-sort-col");
        if (this.sortSelect) this.sortSelect.value = sort;
        this.search(this.input?.value ?? "");
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

  syncHead(sort) {
    if (!this.head) return;
    const row = this.head.querySelector("tr");
    if (row) row.innerHTML = renderHead(sort);
  }

  async search(query) {
    const requestId = ++this.latestRequest;
    const cleanQuery = query.trim();
    const sort = this.sortSelect?.value ?? "mass";
    this.syncHead(sort);

    if (this.status) {
      this.status.textContent = cleanQuery
        ? `Filtering "${cleanQuery}" and sorting by ${sort} in a dedicated Worker…`
        : `Sorting the full meteorite dataset by ${sort} in a dedicated Worker…`;
    }

    try {
      const result = await this.searchWorker.call("filter", {
        dataUrl: this.state.dataUrl,
        limit: 50,
        query: cleanQuery,
        sort,
      });

      if (requestId !== this.latestRequest) return;

      this.results.innerHTML = renderRows(result.results);
      this.status.innerHTML = statusText({
        duration: result.duration,
        query: cleanQuery,
        rendered: result.results.length,
        sort: result.sort,
        total: result.total,
      });
    } catch (error) {
      if (requestId !== this.latestRequest || !this.status) return;
      this.status.textContent = error?.message ?? "Worker search failed.";
    }
  }
}

customElements.define("worker-search-app", WorkerSearchApp);
