import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  addTask,
  clearCompleted,
  createInitialState,
  filterFromPath,
  normalizeState,
  pathForFilter,
  removeTask,
  restoreState,
  serializeState,
  STORAGE_KEY,
  titleForFilter,
  toggleTask,
} from "../model/todo-state.js";
import { renderTodoAppShadow, todoAppStyles } from "./todo-app-template.js";

const storageAvailable = () => {
  try {
    const key = "__nativefragments_todo_check__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const readServerState = (element) => {
  try {
    return normalizeState(JSON.parse(element.getAttribute("data-state") ?? ""));
  } catch {
    return createInitialState({ filter: element.dataset.filter });
  }
};

const readStoredState = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStoredState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, serializeState(state));
    return true;
  } catch {
    return false;
  }
};

const setDocumentMeta = (filter) => {
  const path = pathForFilter(filter);
  document.title = `${titleForFilter(filter)} · Native Fragments Todo Demo`;
  document.querySelector('link[rel="canonical"]')?.setAttribute(
    "href",
    `https://todo-app.nativefragments.org${path}`,
  );
};

export class TodoApp extends LitElement {
  static styles = unsafeCSS(todoAppStyles);

  render() {
    this.state ??= readServerState(this);
    this.message ??= "Server rendered. Edits save in this browser.";
    return html`<div
      @submit=${this.handleSubmit}
      @click=${this.handleClick}
      @change=${this.handleChange}
    >${unsafeHTML(renderTodoAppShadow(this.state, { message: this.message }))}</div>`;
  }

  firstUpdated() {
    this.storageEnabled = storageAvailable();
    const filter = filterFromPath(window.location.pathname);
    const fallback = normalizeState({ ...this.state, filter });
    this.state = this.storageEnabled ? restoreState(readStoredState(), fallback) : fallback;
    this.message = this.storageEnabled
      ? "Saved locally in this browser."
      : "Local storage is unavailable in this browser.";
    this.onPopState = () => this.applyFilter(filterFromPath(window.location.pathname));
    this.onStorage = (event) => this.handleStorage(event);
    window.addEventListener("popstate", this.onPopState);
    window.addEventListener("storage", this.onStorage);
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener("storage", this.onStorage);
  }

  save(message) {
    if (this.storageEnabled && writeStoredState(this.state)) {
      this.message = message ?? "Saved locally in this browser.";
    } else {
      this.message = "Local storage is unavailable in this browser.";
    }
    this.dispatchEvent(new CustomEvent("todo-state-change", { bubbles: true }));
  }

  handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.dataset.action !== "add") return;
    event.preventDefault();
    const nextState = addTask(this.state, new FormData(form).get("title"));
    if (nextState.tasks.length === this.state.tasks.length) {
      this.message = "Enter a task name first.";
    } else {
      this.state = nextState;
      this.save("Task added. Saved locally.");
    }
    this.requestUpdate();
    this.updateComplete.then(() => this.shadowRoot.querySelector('input[name="title"]')?.focus());
  }

  handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const filterLink = target.closest("a[data-filter]");
    if (filterLink) {
      event.preventDefault();
      this.applyFilter(filterLink.dataset.filter, { push: true });
      return;
    }
    const action = target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "remove") {
      this.state = removeTask(this.state, action.dataset.taskId);
      this.save("Task removed. Saved locally.");
    }
    if (action.dataset.action === "clear-completed") {
      this.state = clearCompleted(this.state);
      this.save("Completed tasks cleared. Saved locally.");
    }
    this.requestUpdate();
  }

  handleChange(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.dataset.action !== "toggle") return;
    this.state = toggleTask(this.state, input.dataset.taskId);
    this.save("Task state saved locally.");
    this.requestUpdate();
  }

  handleStorage(event) {
    if (event.key !== STORAGE_KEY) return;
    this.state = restoreState(
      event.newValue,
      normalizeState({ ...this.state, filter: filterFromPath(window.location.pathname) }),
    );
    this.message = "Synced from another tab.";
    this.requestUpdate();
  }

  applyFilter(filter, { push = false } = {}) {
    const path = pathForFilter(filter);
    const nextFilter = filterFromPath(path);
    if (push && window.location.pathname !== path) {
      window.history.pushState({ todoFilter: nextFilter }, "", path);
    }
    this.state = normalizeState({ ...this.state, filter: nextFilter });
    this.message = `${titleForFilter(nextFilter)} view. State stays local.`;
    setDocumentMeta(nextFilter);
    this.requestUpdate();
  }
}

if (!customElements.get("todo-app")) {
  customElements.define("todo-app", TodoApp);
}
