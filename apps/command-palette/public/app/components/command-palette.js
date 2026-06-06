import { shadow, sheet } from "/nativefragments/component.js";
import {
  paletteHtml,
  paletteStyles,
  searchCommands,
} from "./command-palette-template.js";

const styles = sheet(paletteStyles);

class CommandPalette extends HTMLElement {
  connectedCallback() {
    this.activeIndex = 0;
    this.query = "";
    this.render();
    this.bind();
  }

  render() {
    this.items = searchCommands(this.query);
    this.activeIndex = Math.min(this.activeIndex, Math.max(this.items.length - 1, 0));
    shadow(this, {
      styles: [styles],
      html: paletteHtml(this.items, this.activeIndex),
    });
  }

  bind() {
    const root = this.shadowRoot;
    const input = root.querySelector("input");

    input?.addEventListener("input", () => {
      this.query = input.value;
      this.activeIndex = 0;
      this.render();
      this.bind();
      this.shadowRoot.querySelector("input")?.focus();
    });

    input?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.items.length - 1);
        this.render();
        this.bind();
        this.shadowRoot.querySelector("input")?.focus();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.render();
        this.bind();
        this.shadowRoot.querySelector("input")?.focus();
      }
    });

    this.shortcutHandler ??= (event) => {
      if (event.key !== "/" || event.target?.matches?.("input, textarea, select")) return;
      event.preventDefault();
      this.shadowRoot.querySelector("input")?.focus();
    };

    window.addEventListener("keydown", this.shortcutHandler);
  }

  disconnectedCallback() {
    if (this.shortcutHandler) window.removeEventListener("keydown", this.shortcutHandler);
  }
}

customElements.define("command-palette", CommandPalette);
