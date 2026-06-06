import { shadow, sheet } from "/nativefragments/component.js";
import {
  applyCounterAction,
  counterView,
  createCounterState,
} from "./counter-model.js";
import {
  counterStyles,
  renderCounterShadow,
  renderHistoryRows,
} from "./signal-counter-template.js";
import {
  bindAttribute,
  bindDisabled,
  bindHTML,
  bindText,
  cleanupAll,
  computed,
  signal,
} from "./tiny-signals.js";

const styles = sheet(counterStyles);

const numberAttribute = (element, name, fallback) => {
  const value = Number(element.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
};

class SignalCounter extends HTMLElement {
  connectedCallback() {
    const initialState = createCounterState({
      count: numberAttribute(this, "count", 0),
      step: numberAttribute(this, "step", 1),
    });
    const root = shadow(this, {
      styles: [styles],
      html: renderCounterShadow(initialState),
    });

    if (this.cleanup) return;

    const state = signal(initialState);
    const view = computed([state], () => counterView(state.value));
    const cleanups = [];

    const update = (action) => {
      state.value = applyCounterAction(state.value, action);
      this.setAttribute("count", String(state.value.count));
      this.setAttribute("step", String(state.value.step));
      this.dispatchEvent(
        new CustomEvent("signal-counter-change", {
          bubbles: true,
          detail: state.value,
        }),
      );
    };

    const onClick = (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.dataset.action) {
        update(button.dataset.action);
        return;
      }

      if (button.dataset.step) {
        update({ type: "set-step", step: Number(button.dataset.step) });
      }
    };

    const stepButtons = [...root.querySelectorAll(".seg [data-step]")];
    const syncStepPressed = view.subscribe((next) => {
      for (const button of stepButtons) {
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.step) === next.step),
        );
      }
    });

    root.addEventListener("click", onClick);
    cleanups.push(() => root.removeEventListener("click", onClick));
    cleanups.push(() => view.dispose());
    cleanups.push(
      syncStepPressed,
      bindText(root, '[data-bind="count"]', view, (next) => next.countLabel),
      bindText(root, '[data-bind="step"]', view, (next) => next.stepLabel),
      bindText(root, '[data-bind="status"]', view, (next) => next.status),
      bindText(root, '[data-bind="doubled"]', view, (next) => next.doubledLabel),
      bindText(root, '[data-bind="parity"]', view, (next) => next.parity),
      bindText(root, '[data-bind="distance"]', view, (next) => next.distanceLabel),
      bindText(root, '[data-bind="history-count"]', view, (next) => `${next.history.length} of 9`),
      bindAttribute(root, ".panel", "data-tone", view, (next) => next.tone),
      bindAttribute(root, ".meter", "aria-valuenow", state, (next) => next.count),
      bindAttribute(root, ".meter-fill", "style", view, (next) => `--progress: ${next.progress}%`),
      bindAttribute(root, ".feed", "aria-label", view, (next) => `Recent counter values: ${next.historyLabel}`),
      bindHTML(root, '[data-bind="history"]', view, renderHistoryRows),
      bindDisabled(root, '[data-action="decrement"]', view, (next) => !next.canDecrement),
      bindDisabled(root, '[data-action="increment"]', view, (next) => !next.canIncrement),
    );

    this.cleanup = () => {
      cleanupAll(cleanups);
      this.cleanup = null;
    };
  }

  disconnectedCallback() {
    this.cleanup?.();
  }
}

customElements.define("signal-counter", SignalCounter);
