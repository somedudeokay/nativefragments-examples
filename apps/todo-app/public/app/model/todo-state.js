export const STORAGE_KEY = "nativefragments.todo-app.v1";

export const FILTERS = ["all", "active", "completed"];

export const DEFAULT_SAVED_AT = "2026-06-01T08:00:00.000Z";

export const DEFAULT_TASKS = Object.freeze([
  Object.freeze({
    id: "seed-outline-flow",
    title: "Outline the local-first flow",
    completed: false,
    createdAt: "2026-06-01T08:00:00.000Z",
    completedAt: null,
  }),
  Object.freeze({
    id: "seed-render-shadow",
    title: "Server-render the Shadow DOM shell",
    completed: true,
    createdAt: "2026-06-01T08:12:00.000Z",
    completedAt: "2026-06-01T08:29:00.000Z",
  }),
  Object.freeze({
    id: "seed-wire-filters",
    title: "Wire active and completed filters",
    completed: false,
    createdAt: "2026-06-01T08:34:00.000Z",
    completedAt: null,
  }),
]);

const cleanText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const safeIso = (value, fallback = DEFAULT_SAVED_AT) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
  }

  return fallback;
};

const taskNumber = (id) => {
  const match = /^task-(\d+)$/.exec(String(id ?? ""));
  return match ? Number(match[1]) : 0;
};

const cloneTask = (task) => ({
  completed: Boolean(task.completed),
  completedAt: task.completedAt ? safeIso(task.completedAt, null) : null,
  createdAt: safeIso(task.createdAt),
  id: cleanText(task.id),
  title: cleanText(task.title),
});

const normalizeTask = (task, index) => {
  if (!task || typeof task !== "object") return null;

  const title = cleanText(task.title);
  if (!title) return null;

  return {
    completed: Boolean(task.completed),
    completedAt: task.completedAt ? safeIso(task.completedAt, null) : null,
    createdAt: safeIso(task.createdAt),
    id: cleanText(task.id) || `task-${index + 1}`,
    title,
  };
};

export const defaultTasks = () => DEFAULT_TASKS.map(cloneTask);

export const normalizeFilter = (filter) =>
  FILTERS.includes(filter) ? filter : "all";

export const filterFromPath = (pathname = "/") => {
  const segment = String(pathname).replace(/^\/+|\/+$/g, "");
  return normalizeFilter(segment || "all");
};

export const pathForFilter = (filter) => {
  const normalized = normalizeFilter(filter);
  return normalized === "all" ? "/" : `/${normalized}`;
};

export const titleForFilter = (filter) => {
  const normalized = normalizeFilter(filter);
  if (normalized === "active") return "Active Tasks";
  if (normalized === "completed") return "Completed Tasks";
  return "Todo App";
};

export const normalizeState = (state = {}, fallback = {}) => {
  const source = state && typeof state === "object" ? state : {};
  const fallbackTasks = Array.isArray(fallback.tasks)
    ? fallback.tasks.map(cloneTask)
    : defaultTasks();
  const tasks = Array.isArray(source.tasks)
    ? source.tasks.map(normalizeTask).filter(Boolean)
    : fallbackTasks;
  const nextTaskNumber = tasks.reduce(
    (next, task) => Math.max(next, taskNumber(task.id) + 1),
    1,
  );
  const requestedNextId =
    Number.isSafeInteger(source.nextId) && source.nextId > 0
      ? source.nextId
      : nextTaskNumber;

  return {
    version: 1,
    filter: normalizeFilter(source.filter ?? fallback.filter),
    nextId: Math.max(requestedNextId, nextTaskNumber),
    savedAt: safeIso(source.savedAt, fallback.savedAt ?? DEFAULT_SAVED_AT),
    tasks,
  };
};

export const createInitialState = (options = {}) =>
  normalizeState({
    filter: options.filter ?? "all",
    nextId: options.nextId ?? 1,
    savedAt: options.savedAt ?? DEFAULT_SAVED_AT,
    tasks: options.tasks ?? defaultTasks(),
  });

export const countTasks = (tasks = []) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return {
    active: total - completed,
    all: total,
    completed,
  };
};

export const visibleTasks = (state) => {
  const normalized = normalizeState(state);
  if (normalized.filter === "active") {
    return normalized.tasks.filter((task) => !task.completed);
  }
  if (normalized.filter === "completed") {
    return normalized.tasks.filter((task) => task.completed);
  }
  return normalized.tasks;
};

export const addTask = (state, title, options = {}) => {
  const normalized = normalizeState(state);
  const cleanTitle = cleanText(title);
  if (!cleanTitle) return normalized;

  const now = safeIso(options.now ?? Date.now());
  const nextId = Number.isSafeInteger(options.nextId)
    ? options.nextId
    : normalized.nextId;
  const task = {
    completed: false,
    completedAt: null,
    createdAt: now,
    id: options.id ? cleanText(options.id) : `task-${nextId}`,
    title: cleanTitle,
  };

  return normalizeState({
    ...normalized,
    nextId: nextId + 1,
    savedAt: now,
    tasks: [task, ...normalized.tasks],
  });
};

export const toggleTask = (state, id, options = {}) => {
  const normalized = normalizeState(state);
  const now = safeIso(options.now ?? Date.now());
  const taskId = cleanText(id);

  return normalizeState({
    ...normalized,
    savedAt: now,
    tasks: normalized.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: task.completed ? null : now,
          }
        : task,
    ),
  });
};

export const removeTask = (state, id, options = {}) => {
  const normalized = normalizeState(state);
  const taskId = cleanText(id);

  return normalizeState({
    ...normalized,
    savedAt: safeIso(options.now ?? Date.now()),
    tasks: normalized.tasks.filter((task) => task.id !== taskId),
  });
};

export const clearCompleted = (state, options = {}) => {
  const normalized = normalizeState(state);

  return normalizeState({
    ...normalized,
    savedAt: safeIso(options.now ?? Date.now()),
    tasks: normalized.tasks.filter((task) => !task.completed),
  });
};

export const serializeState = (state) => {
  const normalized = normalizeState(state);
  return JSON.stringify({
    nextId: normalized.nextId,
    savedAt: normalized.savedAt,
    tasks: normalized.tasks,
    version: 1,
  });
};

export const restoreState = (serialized, fallback = createInitialState()) => {
  if (!serialized) return normalizeState(fallback);

  try {
    const parsed = JSON.parse(serialized);
    return normalizeState(
      {
        ...parsed,
        filter: fallback.filter,
      },
      fallback,
    );
  } catch {
    return normalizeState(fallback);
  }
};
