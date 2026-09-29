import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/todo-app.js";
import {
  addTask,
  createInitialState,
  filterFromPath,
} from "../../client/model/todo-state.js";

export const todoPage = ({ url } = { url: new URL("https://todo-app.nativefragments.org/") }) => {
  const filter = filterFromPath(url.pathname);
  const initialState = createInitialState({ filter });
  const added = url.searchParams.get("added");
  const state = added
    ? addTask(initialState, added, { now: url.searchParams.get("addedAt") ?? Date.now() })
    : initialState;

  return renderLit(html`<todo-app
    data-filter=${filter}
    data-state=${JSON.stringify(state)}
  ></todo-app>`);
};
