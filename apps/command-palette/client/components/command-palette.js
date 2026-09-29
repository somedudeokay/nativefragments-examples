import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  paletteHtml,
  paletteStyles,
  searchCommands,
} from "./command-palette-template.js";

export class CommandPalette extends LitElement {
  static styles = unsafeCSS(paletteStyles);

  constructor() {
    super();
    this.activeIndex = 0;
    this.query = "";
  }

  render() {
    this.items = searchCommands(this.query);
    this.activeIndex = Math.min(this.activeIndex, Math.max(this.items.length - 1, 0));
    return html`<div @input=${this.handleInput} @keydown=${this.handleKeydown}>${unsafeHTML(
      paletteHtml(this.items, this.activeIndex, this.query),
    )}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shortcutHandler ??= (event) => {
      if (event.key !== "/" || event.target?.matches?.("input, textarea, select")) return;
      event.preventDefault();
      this.shadowRoot.querySelector("input")?.focus();
    };
    window.addEventListener("keydown", this.shortcutHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.shortcutHandler) window.removeEventListener("keydown", this.shortcutHandler);
  }

  handleInput(event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.query = event.target.value;
    this.activeIndex = 0;
    this.requestUpdate();
    this.updateComplete.then(() => this.shadowRoot.querySelector("input")?.focus());
  }

  handleKeydown(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const offset = event.key === "ArrowDown" ? 1 : -1;
    this.activeIndex = Math.max(0, Math.min(this.activeIndex + offset, this.items.length - 1));
    this.requestUpdate();
    this.updateComplete.then(() => this.shadowRoot.querySelector("input")?.focus());
  }
}

if (!customElements.get("command-palette")) {
  customElements.define("command-palette", CommandPalette);
}
