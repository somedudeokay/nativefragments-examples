import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { DEFAULT_THEME, STORAGE_KEY, THEMES, resolveTheme } from "../theme-model.js";
import {
  themeSwitcherHtml,
  themeSwitcherStyles,
} from "./theme-switcher-template.js";

const readStoredTheme = () => {
  try {
    return resolveTheme(localStorage.getItem(STORAGE_KEY)).id;
  } catch {
    return DEFAULT_THEME;
  }
};

export class ThemeSwitcher extends LitElement {
  static styles = unsafeCSS(themeSwitcherStyles);

  constructor() {
    super();
    this.selectedTheme = DEFAULT_THEME;
  }

  connectedCallback() {
    super.connectedCallback();
    this.selectedTheme = readStoredTheme();
    this.requestUpdate();
  }

  firstUpdated() {
    this.applyTheme(this.selectedTheme, { persist: false });
  }

  render() {
    return html`<div @click=${this.handleClick} @keydown=${this.handleKeydown}>${unsafeHTML(
      themeSwitcherHtml({ selectedTheme: this.selectedTheme, themes: THEMES }),
    )}</div>`;
  }

  handleClick(event) {
    const option = event.target.closest("[data-theme-option]");
    if (option) this.applyTheme(option.dataset.themeOption);
  }

  handleKeydown(event) {
    const navigationKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!navigationKeys.includes(event.key)) return;

    const options = [...this.shadowRoot.querySelectorAll("[data-theme-option]")];
    const currentIndex = options.findIndex(
      (option) => option.dataset.themeOption === this.selectedTheme,
    );
    const lastIndex = options.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    }

    event.preventDefault();
    this.applyTheme(options[nextIndex]?.dataset.themeOption);
    this.updateComplete.then(() => {
      this.shadowRoot.querySelectorAll("[data-theme-option]")[nextIndex]?.focus();
    });
  }

  applyTheme(themeId, { persist = true } = {}) {
    const theme = resolveTheme(themeId);
    this.selectedTheme = theme.id;
    document.documentElement.dataset.theme = theme.id;

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme.id);
      } catch {}
    }

    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("themechange", {
        bubbles: true,
        detail: { theme: theme.id },
      }),
    );
  }
}

if (!customElements.get("theme-switcher")) {
  customElements.define("theme-switcher", ThemeSwitcher);
}
