import {
  declarativeShadow,
  html,
  jsonScript,
  raw,
} from "@nativefragments/core/server";
import {
  addTask,
  createInitialState,
  filterFromPath,
} from "../../public/app/model/todo-state.js";
import {
  renderTodoAppShadow,
  todoAppStyles,
} from "../../public/app/components/todo-app-template.js";

export const todoPage = ({ url } = { url: new URL("https://todo-app.nativefragments.org/") }) => {
  const filter = filterFromPath(url.pathname);
  const initialState = createInitialState({ filter });
  const added = url.searchParams.get("added");
  const state = added
    ? addTask(initialState, added, { now: url.searchParams.get("addedAt") ?? Date.now() })
    : initialState;

  return html`<todo-app data-filter="${filter}">
    ${declarativeShadow({
      styles: [todoAppStyles],
      html: renderTodoAppShadow(state, {
        message: added
          ? "Server handled the POST. Edits save in this browser once JavaScript loads."
          : "Server rendered. Edits save in this browser.",
      }),
    })}
    <script type="application/json" data-todo-state>${raw(jsonScript(state))}</script>
  </todo-app>`;
};
