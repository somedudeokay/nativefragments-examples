import { shadow, sheet } from "/nativefragments/component.js";
import {
  analyticsBoardStyles,
  renderAnalyticsBoard,
  resolveDashboardState,
} from "./analytics-board-template.js";

const styles = sheet(analyticsBoardStyles);

class AnalyticsBoard extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  handleEvent(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("button[data-range], button[data-segment]");
    if (!button) return;

    if (button.dataset.range) this.dataset.range = button.dataset.range;
    if (button.dataset.segment) this.dataset.segment = button.dataset.segment;

    this.render();
  }

  render() {
    const state = resolveDashboardState({
      range: this.dataset.range,
      section: this.dataset.section,
      segment: this.dataset.segment,
    });

    this.dataset.range = state.range.id;
    this.dataset.section = state.section.id;
    this.dataset.segment = state.segment.id;

    const root = shadow(this, {
      styles: [styles],
      html: renderAnalyticsBoard(state),
    });

    if (!this._wired) {
      root.addEventListener("click", this);
      this._wired = true;
    }
  }
}

customElements.define("analytics-board", AnalyticsBoard);
