import {
  declarativeShadow,
  html,
  jsonScript,
  raw,
} from "@nativefragments/core/server";
import {
  createInitialState,
  filterFromPath,
} from "../../public/app/model/todo-state.js";
import {
  renderTodoAppShadow,
  todoAppStyles,
} from "../../public/app/components/todo-app-template.js";

export const todoPage = ({ url } = { url: new URL("https://todo-app.nativefragments.org/") }) => {
  const filter = filterFromPath(url.pathname);
  const state = createInitialState({ filter });

  return html`<todo-app data-filter="${filter}">
    ${declarativeShadow({
      styles: [todoAppStyles],
      html: renderTodoAppShadow(state, {
        message: "Server rendered. Edits save in this browser.",
      }),
    })}
    ${raw(
      `<script type="application/json" data-todo-state>${jsonScript(
        state,
      )}</script>`,
    )}
  </todo-app>`;
};
