import { shadow, sheet } from "/nativefragments/component.js";
import { DEFAULT_THEME, STORAGE_KEY, THEMES, resolveTheme } from "../theme-model.js";
import {
  themeSwitcherHtml,
  themeSwitcherStyles,
} from "./theme-switcher-template.js";

const styles = sheet(themeSwitcherStyles);

const readStoredTheme = () => {
  try {
    return resolveTheme(localStorage.getItem(STORAGE_KEY)).id;
  } catch (error) {
    return DEFAULT_THEME;
  }
};

class ThemeSwitcher extends HTMLElement {
  connectedCallback() {
    const selectedTheme = readStoredTheme();
    const root = shadow(this, {
      styles: [styles],
      html: themeSwitcherHtml({
        selectedTheme,
        themes: THEMES,
      }),
    });

    this.applyTheme(selectedTheme, { persist: false, root });

    if (this.wired) return;
    this.wired = true;
    this.root = root;

    root.addEventListener("click", (event) => {
      const option = event.target.closest("[data-theme-option]");
      if (!option) return;
      this.applyTheme(option.dataset.themeOption, { root });
    });

    root.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) {
        return;
      }

      const options = [...root.querySelectorAll("[data-theme-option]")];
      const currentIndex = options.findIndex(
        (option) => option.getAttribute("aria-checked") === "true",
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
      options[nextIndex]?.focus();
      this.applyTheme(options[nextIndex]?.dataset.themeOption, { root });
    });
  }

  applyTheme(themeId, { persist = true, root = this.root } = {}) {
    const theme = resolveTheme(themeId);
    document.documentElement.dataset.theme = theme.id;

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme.id);
      } catch (error) {}
    }

    root?.querySelectorAll("[data-theme-option]").forEach((option) => {
      option.setAttribute(
        "aria-checked",
        String(option.dataset.themeOption === theme.id),
      );
    });

    const tag = root?.querySelector("[data-current-theme]");
    if (tag) tag.textContent = theme.id;

    const activeLabel = root?.querySelector("[data-active-label]");
    if (activeLabel) activeLabel.textContent = theme.label;

    root?.querySelectorAll("[data-token-value]").forEach((cell) => {
      const value = theme.tokens[cell.dataset.tokenValue];
      if (value) cell.textContent = value;
    });

    this.dispatchEvent(
      new CustomEvent("themechange", {
        bubbles: true,
        detail: { theme: theme.id },
      }),
    );
  }
}

customElements.define("theme-switcher", ThemeSwitcher);
