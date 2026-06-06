export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  const notify = () => {
    for (const subscriber of subscribers) subscriber(value);
  };

  return {
    get value() {
      return value;
    },
    set value(nextValue) {
      if (Object.is(nextValue, value)) return;
      value = nextValue;
      notify();
    },
    subscribe(subscriber, { immediate = true } = {}) {
      subscribers.add(subscriber);
      if (immediate) subscriber(value);
      return () => subscribers.delete(subscriber);
    },
  };
};

export const computed = (sources, derive) => {
  const output = signal(derive());
  const update = () => {
    output.value = derive();
  };
  const cleanups = sources.map((source) =>
    source.subscribe(update, { immediate: false }),
  );

  output.dispose = () => {
    for (const cleanup of cleanups) cleanup();
  };

  return output;
};

const first = (root, selector) => root.querySelector(selector);
const all = (root, selector) => [...root.querySelectorAll(selector)];

export const bindText = (root, selector, source, format = (value) => value) => {
  const node = first(root, selector);
  if (!node) return () => {};
  return source.subscribe((value) => {
    node.textContent = String(format(value));
  });
};

export const bindAttribute = (
  root,
  selector,
  name,
  source,
  format = (value) => value,
) => {
  const node = first(root, selector);
  if (!node) return () => {};
  return source.subscribe((value) => {
    const next = format(value);
    if (next === false || next == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, String(next));
    }
  });
};

export const bindDisabled = (root, selector, source, isDisabled) => {
  const nodes = all(root, selector);
  if (nodes.length === 0) return () => {};
  return source.subscribe((value) => {
    const disabled = Boolean(isDisabled(value));
    for (const node of nodes) node.disabled = disabled;
  });
};

export const bindHTML = (root, selector, source, format) => {
  const node = first(root, selector);
  if (!node) return () => {};
  return source.subscribe((value) => {
    node.innerHTML = format(value);
  });
};

export const cleanupAll = (cleanups) => {
  for (const cleanup of cleanups.splice(0)) cleanup();
};
