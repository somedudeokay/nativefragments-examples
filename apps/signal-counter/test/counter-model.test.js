import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyCounterAction,
  counterConfig,
  counterView,
  createCounterState,
} from "../public/app/components/counter-model.js";
import { computed, signal } from "../public/app/components/tiny-signals.js";

describe("counter model", () => {
  it("clamps initial count and step", () => {
    assert.deepEqual(createCounterState({ count: 200, step: 99 }), {
      count: counterConfig.max,
      history: [counterConfig.max],
      step: 6,
    });

    assert.deepEqual(createCounterState({ count: -200, step: -4 }), {
      count: counterConfig.min,
      history: [counterConfig.min],
      step: 1,
    });
  });

  it("applies counter actions and preserves bounded history", () => {
    let state = createCounterState({ step: 2 });
    state = applyCounterAction(state, "increment");
    state = applyCounterAction(state, "increment");
    state = applyCounterAction(state, "decrement");

    assert.equal(state.count, 2);
    assert.deepEqual(state.history, [0, 2, 4, 2]);

    state = applyCounterAction(state, { type: "set-step", step: 5 });
    state = applyCounterAction(state, "increment");
    assert.equal(state.count, 7);
    assert.equal(state.step, 5);

    state = applyCounterAction(state, "reset");
    assert.deepEqual(state, { count: 0, history: [0], step: 5 });
  });

  it("derives view state for DOM bindings", () => {
    const view = counterView({
      count: -6,
      history: [0, -2, -6],
      step: 3,
    });

    assert.equal(view.tone, "negative");
    assert.equal(view.status, "below origin");
    assert.equal(view.countLabel, "-6");
    assert.equal(view.stepLabel, "3");
    assert.equal(view.canDecrement, true);
    assert.equal(view.canIncrement, true);
    assert.equal(view.historyLabel, "0, -2, -6");
  });
});

describe("tiny signals", () => {
  it("notifies subscribers and updates computed values", () => {
    const count = signal(1);
    const doubled = computed([count], () => count.value * 2);
    const values = [];
    const cleanup = doubled.subscribe((value) => values.push(value));

    count.value = 2;
    count.value = 4;

    assert.deepEqual(values, [2, 4, 8]);
    cleanup();
    doubled.dispose();
  });
});
