import { route } from "@nativefragments/core/server";
import { homePage } from "./pages/home.js";

const origin = "https://signal-counter.nativefragments.org";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${title} - Signal Counter - Native Fragments Demo`,
});

export const routes = [
  route("/", {
    meta: () =>
      meta(
        "/",
        "Reactive DOM without a build step",
        "A Native Fragments Signal Counter demo with server-rendered Shadow DOM and hydrated reactive bindings.",
      ),
    render: homePage,
  }),
];
