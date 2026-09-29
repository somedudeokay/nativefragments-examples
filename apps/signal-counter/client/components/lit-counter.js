import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  applyCounterAction,
  createCounterState,
} from "./counter-model.js";
import {
  counterStyles,
  renderCounterShadow,
} from "./lit-counter-template.js";

const numberAttribute = (element, name, fallback) => {
  const value = Number(element.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
};

export class LitCounter extends LitElement {
  static styles = unsafeCSS(counterStyles);

  render() {
    this.state ??= createCounterState({
      count: numberAttribute(this, "count", 0),
      step: numberAttribute(this, "step", 1),
    });
    return html`<div @click=${this.handleClick}>${unsafeHTML(renderCounterShadow(this.state))}</div>`;
  }

  handleClick(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action ?? (
      button.dataset.step
        ? { type: "set-step", step: Number(button.dataset.step) }
        : null
    );
    if (!action) return;

    this.state = applyCounterAction(this.state, action);
    this.setAttribute("count", String(this.state.count));
    this.setAttribute("step", String(this.state.step));
    this.requestUpdate();
      this.dispatchEvent(
        new CustomEvent("lit-counter-change", {
          bubbles: true,
          detail: this.state,
        }),
      );
  }
}

if (!customElements.get("lit-counter")) {
  customElements.define("lit-counter", LitCounter);
}
