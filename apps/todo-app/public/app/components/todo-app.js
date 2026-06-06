import { shadow, sheet } from "/nativefragments/component.js";
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

const styles = sheet(todoAppStyles);

const storageAvailable = () => {
  try {
    const key = "__nativefragments_todo_check__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const readStoredState = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStoredState = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeState(state));
    return true;
  } catch {
    return false;
  }
};

const readServerState = (element) => {
  const node = element.querySelector("script[data-todo-state]");
  if (!node?.textContent) return null;

  try {
    return normalizeState(JSON.parse(node.textContent));
  } catch {
    return null;
  }
};

const setDocumentMeta = (filter) => {
  const title = `${titleForFilter(filter)} · Native Fragments Todo Demo`;
  const path = pathForFilter(filter);
  document.title = title;
  document.querySelector('link[rel="canonical"]')?.setAttribute(
    "href",
    `https://todo-app.nativefragments.org${path}`,
  );
};

class TodoApp extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    this._storage = storageAvailable();

    const filter = filterFromPath(window.location.pathname);
    const serverState =
      readServerState(this) ?? createInitialState({ filter: this.dataset.filter });
    const fallback = normalizeState({ ...serverState, filter });
    this.state = this._storage ? restoreState(readStoredState(), fallback) : fallback;
    this.state = normalizeState({ ...this.state, filter });
    this.message = this._storage
      ? "Saved locally in this browser."
      : "Local storage is unavailable in this browser.";

    this._root = shadow(this, {
      styles: [styles],
      html: renderTodoAppShadow(this.state, { message: this.message }),
    });
    this._wire();
    this._render();
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this._root?.removeEventListener("submit", this._onSubmit);
    this._root?.removeEventListener("click", this._onClick);
    this._root?.removeEventListener("change", this._onChange);
    window.removeEventListener("popstate", this._onPopState);
    window.removeEventListener("storage", this._onStorage);
    this._wired = false;
    this._connected = false;
  }

  _wire() {
    if (this._wired) return;
    this._wired = true;
    this._onSubmit = (event) => this._handleSubmit(event);
    this._onClick = (event) => this._handleClick(event);
    this._onChange = (event) => this._handleChange(event);
    this._onPopState = () => this._applyFilter(filterFromPath(window.location.pathname));
    this._onStorage = (event) => this._handleStorage(event);

    this._root.addEventListener("submit", this._onSubmit);
    this._root.addEventListener("click", this._onClick);
    this._root.addEventListener("change", this._onChange);
    window.addEventListener("popstate", this._onPopState);
    window.addEventListener("storage", this._onStorage);
  }

  _render({ focusTitle = false } = {}) {
    this._root = shadow(this, {
      styles: [styles],
      html: renderTodoAppShadow(this.state, { message: this.message }),
    });

    if (focusTitle) {
      this._root.querySelector('input[name="title"]')?.focus();
    }
  }

  _save(message) {
    if (this._storage && writeStoredState(this.state)) {
      this.message = message ?? "Saved locally in this browser.";
    } else {
      this.message = "Local storage is unavailable in this browser.";
    }
  }

  _handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.dataset.action !== "add") return;

    event.preventDefault();
    const data = new FormData(form);
    const title = data.get("title");
    const nextState = addTask(this.state, title);

    if (nextState.tasks.length === this.state.tasks.length) {
      this.message = "Enter a task name first.";
      this._render({ focusTitle: true });
      return;
    }

    this.state = nextState;
    this._save("Task added. Saved locally.");
    this._render({ focusTitle: true });
  }

  _handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const filterLink = target.closest("a[data-filter]");
    if (filterLink) {
      event.preventDefault();
      this._applyFilter(filterLink.dataset.filter, { push: true });
      return;
    }

    const action = target.closest("[data-action]");
    if (!action) return;

    if (action.dataset.action === "remove") {
      this.state = removeTask(this.state, action.dataset.taskId);
      this._save("Task removed. Saved locally.");
      this._render();
      return;
    }

    if (action.dataset.action === "clear-completed") {
      this.state = clearCompleted(this.state);
      this._save("Completed tasks cleared. Saved locally.");
      this._render();
    }
  }

  _handleChange(event) {
    const input = event.target;
    if (
      !(input instanceof HTMLInputElement) ||
      input.dataset.action !== "toggle"
    ) {
      return;
    }

    this.state = toggleTask(this.state, input.dataset.taskId);
    this._save("Task state saved locally.");
    this._render();
  }

  _handleStorage(event) {
    if (event.key !== STORAGE_KEY) return;

    this.state = restoreState(
      event.newValue,
      normalizeState({
        ...this.state,
        filter: filterFromPath(window.location.pathname),
      }),
    );
    this.message = "Synced from another tab.";
    this._render();
  }

  _applyFilter(filter, options = {}) {
    const path = pathForFilter(filter);
    const nextFilter = filterFromPath(path);

    if (options.push && window.location.pathname !== path) {
      window.history.pushState({ todoFilter: nextFilter }, "", path);
    }

    this.state = normalizeState({
      ...this.state,
      filter: nextFilter,
    });
    this.message = `${titleForFilter(nextFilter)} view. State stays local.`;
    setDocumentMeta(nextFilter);
    this._render();
  }
}

customElements.define("todo-app", TodoApp);
