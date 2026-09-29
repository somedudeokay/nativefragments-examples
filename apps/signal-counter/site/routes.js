import { route } from "@nativefragments/core/server";
import { homePage } from "./pages/home.js";

const origin = "https://lit-counter.nativefragments.org";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${title} - Lit Counter - Native Fragments Demo`,
});

export const routes = [
  route("/", {
    meta: () =>
      meta(
        "/",
        "Lit state on streamed server HTML",
        "A Native Fragments Lit counter with server-rendered Shadow DOM and hydration.",
      ),
    render: homePage,
  }),
];
