import { route } from "@nativefragments/core/server";
import {
  dashboardFragment,
  dashboardPage,
  sectionForPath,
} from "./pages/dashboard.js";

const origin = "https://analytics-dashboard.nativefragments.org";

const description =
  "A deployable Native Fragments analytics dashboard demo with server-rendered Shadow DOM and zero app dependencies beyond the framework.";

const metaFor = (path, section) => ({
  canonical: `${origin}${path}`,
  description,
  title: `${section.navLabel} · Analytics Dashboard · Native Fragments Demo`,
});

const pageRoute = (path) =>
  route(path, {
    meta: () => metaFor(path, sectionForPath(path)),
    render: ({ url }) => dashboardPage({ section: sectionForPath(url.pathname) }),
    fragments: [dashboardFragment],
  });

export const routes = [
  pageRoute("/"),
  pageRoute("/acquisition"),
  pageRoute("/revenue"),
  pageRoute("/reliability"),
];
