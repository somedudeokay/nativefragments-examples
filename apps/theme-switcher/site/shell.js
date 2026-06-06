import { html, jsonScript, raw } from "@nativefragments/core/server";
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  themeRootCss,
  themeScriptAllowList,
} from "../public/app/theme-model.js";

const persistedThemeScript = () => {
  const allowList = jsonScript(themeScriptAllowList());
  const storageKey = jsonScript(STORAGE_KEY);

  return `(() => {
  try {
    const allowed = new Set(${allowList});
    const stored = localStorage.getItem(${storageKey});
    if (allowed.has(stored)) {
      document.documentElement.dataset.theme = stored;
    }
  } catch (error) {}
})();`;
};

const head = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <script>${raw(persistedThemeScript())}</script>
  <style>${raw(themeRootCss())}</style>
  <link rel="stylesheet" href="/app/styles.css" />
  <script type="module" src="/app/client.js"></script>
`;

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en" data-theme="${DEFAULT_THEME}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    ${raw(head({ meta }))}
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <main id="content">${raw(body)}</main>
  </body>
</html>`;
