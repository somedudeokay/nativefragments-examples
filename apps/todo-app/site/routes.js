import { redirect, route } from "@nativefragments/core/server";
import { titleForFilter } from "../public/app/model/todo-state.js";
import { todoPage } from "./pages/todo.js";

const origin = "https://todo-app.nativefragments.org";

const meta = (path, filter) => ({
  canonical: `${origin}${path}`,
  description:
    "A local-first Native Fragments todo app with form handling, filters, and a server-rendered Shadow DOM component.",
  title: `${titleForFilter(filter)} · Native Fragments Todo Demo`,
});

const action = async ({ request, url }) => {
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const next = new URL(url);
  if (title) {
    next.searchParams.set("added", title);
    next.searchParams.set("addedAt", new Date().toISOString());
  }
  return redirect(`${next.pathname}${next.search}`, 303);
};

export const routes = [
  route("/", {
    action,
    meta: () => meta("/", "all"),
    render: todoPage,
  }),
  route("/active", {
    action,
    meta: () => meta("/active", "active"),
    render: todoPage,
  }),
  route("/completed", {
    action,
    meta: () => meta("/completed", "completed"),
    render: todoPage,
  }),
];
