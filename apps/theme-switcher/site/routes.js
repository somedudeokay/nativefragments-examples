import { route } from "@nativefragments/core/server";
import { themeSwitcherPage } from "./pages/theme-switcher.js";

const origin = "https://theme-switcher.nativefragments.org";

const meta = (path, title, description) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${title} - Native Fragments Demo`,
});

export const routes = [
  route("/", {
    meta: () =>
      meta(
        "/",
        "Theme Switcher",
        "A zero-build Native Fragments demo showing CSS custom properties shared across light DOM and Shadow DOM.",
      ),
    render: themeSwitcherPage,
  }),
];
