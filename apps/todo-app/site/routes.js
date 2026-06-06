import { route } from "@nativefragments/core/server";
import { titleForFilter } from "../public/app/model/todo-state.js";
import { todoPage } from "./pages/todo.js";

const origin = "https://todo-app.nativefragments.org";

const meta = (path, filter) => ({
  canonical: `${origin}${path}`,
  description:
    "A local-first Native Fragments todo app with form handling, filters, and a server-rendered Shadow DOM component.",
  title: `${titleForFilter(filter)} · Native Fragments Todo Demo`,
});

export const routes = [
  route("/", {
    meta: () => meta("/", "all"),
    render: todoPage,
  }),
  route("/active", {
    meta: () => meta("/active", "active"),
    render: todoPage,
  }),
  route("/completed", {
    meta: () => meta("/completed", "completed"),
    render: todoPage,
  }),
];
