export const counterConfig = Object.freeze({
  defaultCount: 0,
  defaultStep: 1,
  max: 24,
  min: -24,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toInteger = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
};

export const createCounterState = ({
  count = counterConfig.defaultCount,
  history,
  step = counterConfig.defaultStep,
} = {}) => {
  const nextCount = clamp(
    toInteger(count, counterConfig.defaultCount),
    counterConfig.min,
    counterConfig.max,
  );
  const nextStep = clamp(toInteger(step, counterConfig.defaultStep), 1, 6);
  const nextHistory = Array.isArray(history) && history.length > 0
    ? history.map((item) => clamp(toInteger(item, nextCount), counterConfig.min, counterConfig.max))
    : [nextCount];

  return {
    count: nextCount,
    history: nextHistory.slice(-9),
    step: nextStep,
  };
};

export const applyCounterAction = (state, action) => {
  const current = createCounterState(state);
  const type = typeof action === "string" ? action : action?.type;

  if (type === "reset") {
    return createCounterState({
      count: counterConfig.defaultCount,
      step: current.step,
    });
  }

  if (type === "set-step") {
    return createCounterState({
      ...current,
      step: action?.step,
    });
  }

  const delta =
    type === "increment"
      ? current.step
      : type === "decrement"
        ? -current.step
        : 0;
  const count = clamp(current.count + delta, counterConfig.min, counterConfig.max);

  return createCounterState({
    count,
    history: [...current.history, count],
    step: current.step,
  });
};

export const counterView = (state) => {
  const current = createCounterState(state);
  const range = counterConfig.max - counterConfig.min;
  const progress = Math.round(((current.count - counterConfig.min) / range) * 100);
  const tone =
    current.count > 0 ? "positive" : current.count < 0 ? "negative" : "neutral";
  const status =
    tone === "positive"
      ? "above origin"
      : tone === "negative"
        ? "below origin"
        : "at origin";

  return {
    canDecrement: current.count > counterConfig.min,
    canIncrement: current.count < counterConfig.max,
    countLabel: String(current.count),
    history: current.history,
    historyLabel: current.history.join(", "),
    max: counterConfig.max,
    min: counterConfig.min,
    progress,
    status,
    stepLabel: String(current.step),
    tone,
  };
};
