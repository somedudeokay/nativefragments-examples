import { createWorkerClient } from "@nativefragments/core/client/worker.js";
import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  renderHead,
  renderRows,
  renderSearchApp,
  workerSearchStyles,
} from "./worker-search-app-template.js";

const readState = (element) => {
  try {
    return JSON.parse(element.getAttribute("data-state") ?? "");
  } catch {
    return {
      dataUrl: "/app/data/meteorites.json",
      initialRows: [],
      stats: { records: 0, categories: 0, regions: 0 },
    };
  }
};

const statusText = ({ duration, query, rendered, sort, total }) => {
  const label = query ? `for "${query}"` : "across all records";
  return `<b>${total.toLocaleString()}</b> matches ${label} · showing top <b>${rendered}</b> sorted by ${sort} · resolved in <b>${duration.toFixed(1)} ms</b> by a Worker`;
};

export class WorkerSearchApp extends LitElement {
  static styles = unsafeCSS(workerSearchStyles);

  render() {
    this.state ??= readState(this);
    return html`${unsafeHTML(renderSearchApp({
      rows: this.state.initialRows.slice(0, 12),
      stats: this.state.stats,
      sort: "mass",
    }))}`;
  }

  firstUpdated() {
    this.abortController = new AbortController();
    this.searchWorker = createWorkerClient("/build/search-worker.js", { timeout: 30_000 });
    this.input = this.shadowRoot.querySelector("[data-search-input]");
    this.sortSelect = this.shadowRoot.querySelector("[data-sort-select]");
    this.results = this.shadowRoot.querySelector("[data-search-results]");
    this.head = this.shadowRoot.querySelector("[data-search-head]");
    this.status = this.shadowRoot.querySelector("[data-search-status]");
    this.latestRequest = 0;

    this.input?.addEventListener("input", () => {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = window.setTimeout(() => this.search(this.input.value), 90);
    }, { signal: this.abortController.signal });

    this.sortSelect?.addEventListener("change", () => {
      this.search(this.input?.value ?? "");
    }, { signal: this.abortController.signal });

    this.head?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sort-col]");
      if (!button) return;
      if (this.sortSelect) this.sortSelect.value = button.dataset.sortCol;
      this.search(this.input?.value ?? "");
    }, { signal: this.abortController.signal });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearTimeout(this.searchTimer);
    this.abortController?.abort();
    this.searchWorker?.dispose();
  }

  syncHead(sort) {
    const row = this.head?.querySelector("tr");
    if (row) row.innerHTML = renderHead(sort);
  }

  async search(query) {
    const requestId = ++this.latestRequest;
    const cleanQuery = query.trim();
    const sort = this.sortSelect?.value ?? "mass";
    this.syncHead(sort);
    if (this.status) this.status.textContent = `Searching in a dedicated Worker…`;

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
      if (requestId === this.latestRequest && this.status) {
        this.status.textContent = error?.message ?? "Worker search failed.";
      }
    }
  }
}

if (!customElements.get("worker-search-app")) {
  customElements.define("worker-search-app", WorkerSearchApp);
}
