import assert from "node:assert/strict";
import test from "node:test";
import {
  addTask,
  clearCompleted,
  countTasks,
  createInitialState,
  filterFromPath,
  pathForFilter,
  removeTask,
  restoreState,
  serializeState,
  toggleTask,
  visibleTasks,
} from "../public/app/model/todo-state.js";

test("adds trimmed tasks to the front and advances local ids", () => {
  const state = createInitialState({ tasks: [], nextId: 7 });
  const next = addTask(state, "  Write the demo  ", {
    now: "2026-06-02T10:00:00.000Z",
  });

  assert.equal(next.tasks.length, 1);
  assert.equal(next.tasks[0].id, "task-7");
  assert.equal(next.tasks[0].title, "Write the demo");
  assert.equal(next.nextId, 8);
  assert.equal(next.savedAt, "2026-06-02T10:00:00.000Z");
});

test("ignores empty task titles", () => {
  const state = createInitialState({ tasks: [], nextId: 2 });
  const next = addTask(state, "   ");

  assert.deepEqual(next.tasks, []);
  assert.equal(next.nextId, 2);
});

test("toggles completion and filters visible tasks", () => {
  const state = addTask(createInitialState({ tasks: [], nextId: 1 }), "One", {
    now: "2026-06-02T10:00:00.000Z",
  });
  const completed = toggleTask(
    { ...state, filter: "completed" },
    "task-1",
    { now: "2026-06-02T11:00:00.000Z" },
  );

  assert.equal(completed.tasks[0].completed, true);
  assert.equal(visibleTasks(completed).length, 1);
  assert.deepEqual(countTasks(completed.tasks), {
    active: 0,
    all: 1,
    completed: 1,
  });
});

test("removes tasks and clears completed tasks without mutating input", () => {
  const state = createInitialState({
    tasks: [
      {
        id: "task-1",
        title: "Keep",
        completed: false,
        createdAt: "2026-06-02T10:00:00.000Z",
        completedAt: null,
      },
      {
        id: "task-2",
        title: "Done",
        completed: true,
        createdAt: "2026-06-02T10:00:00.000Z",
        completedAt: "2026-06-02T11:00:00.000Z",
      },
    ],
    nextId: 3,
  });

  const removed = removeTask(state, "task-1", {
    now: "2026-06-02T12:00:00.000Z",
  });
  const cleared = clearCompleted(state, {
    now: "2026-06-02T12:30:00.000Z",
  });

  assert.equal(state.tasks.length, 2);
  assert.deepEqual(removed.tasks.map((task) => task.id), ["task-2"]);
  assert.deepEqual(cleared.tasks.map((task) => task.id), ["task-1"]);
});

test("round trips persisted state and keeps the current route filter", () => {
  const state = addTask(createInitialState({ tasks: [], nextId: 1 }), "Persist");
  const restored = restoreState(
    serializeState(state),
    createInitialState({ filter: "active", tasks: [] }),
  );

  assert.equal(restored.filter, "active");
  assert.equal(restored.tasks[0].title, "Persist");
});

test("maps filter routes to stable paths", () => {
  assert.equal(filterFromPath("/"), "all");
  assert.equal(filterFromPath("/active"), "active");
  assert.equal(filterFromPath("/completed/"), "completed");
  assert.equal(filterFromPath("/unknown"), "all");
  assert.equal(pathForFilter("all"), "/");
  assert.equal(pathForFilter("active"), "/active");
  assert.equal(pathForFilter("completed"), "/completed");
});
