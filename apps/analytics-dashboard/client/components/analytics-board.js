import { LitElement, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  analyticsBoardStyles,
  renderAnalyticsBoard,
  resolveDashboardState,
} from "./analytics-board-template.js";

export class AnalyticsBoard extends LitElement {
  static styles = unsafeCSS(analyticsBoardStyles);

  handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("button[data-range], button[data-segment]");
    if (!button) return;

    if (button.dataset.range) this.dataset.range = button.dataset.range;
    if (button.dataset.segment) this.dataset.segment = button.dataset.segment;

    this.requestUpdate();
  }

  render() {
    const state = resolveDashboardState({
      range: this.getAttribute("data-range") ?? "30d",
      section: this.getAttribute("data-section") ?? "overview",
      segment: this.getAttribute("data-segment") ?? "all",
    });

    this.setAttribute("data-range", state.range.id);
    this.setAttribute("data-section", state.section.id);
    this.setAttribute("data-segment", state.segment.id);

    return html`<div @click=${this.handleClick}>${unsafeHTML(renderAnalyticsBoard(state))}</div>`;
  }
}

if (!customElements.get("analytics-board")) {
  customElements.define("analytics-board", AnalyticsBoard);
}
