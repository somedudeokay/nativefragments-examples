import { html, raw } from "@nativefragments/core/server";

const head = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <meta name="theme-color" content="#f4f1ea" />
  <link rel="stylesheet" href="/app/styles.css" />
  <script>
    document.documentElement.classList.add("js");
  </script>
  <script type="module" src="/app/client.js"></script>
`;

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    ${raw(head({ meta }))}
  </head>
  <body>
    <a class="skip-link" href="#settings-panel">Skip to settings panel</a>
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
