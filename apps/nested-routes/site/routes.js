import { fragment, route } from "@nativefragments/core/server";
import { settingsPage } from "./pages/settings.js";
import {
  defaultPanelId,
  panelForPath,
  panelMeta,
  panelRoutes,
  renderPanel,
} from "./panels/index.js";

export const origin = "https://nested-routes.nativefragments.org";

export const settingsPanel = fragment("settings-panel", ({ url }) =>
  renderPanel(panelForPath(url.pathname)),
);

const metaForPanel = (path, panelId) => {
  const panel = panelMeta(panelId);

  return {
    title: `${panel.title} · Nested Routes Demo`,
    description: panel.description,
    canonical: `${origin}${path}`,
  };
};

const settingsRoute = (path, panelId) =>
  route(path, {
    meta: () => metaForPanel(path, panelId),
    render: () => settingsPage({ activePanel: panelId, settingsPanel }),
    fragments: [settingsPanel],
  });

export const routes = [
  settingsRoute("/", defaultPanelId),
  ...panelRoutes.map(({ path, id }) => settingsRoute(path, id)),
];
