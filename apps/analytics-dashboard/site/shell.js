import { html, raw } from "@nativefragments/core/server";

const head = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <meta name="theme-color" content="#161511" />
  <script>
    document.documentElement.classList.add("js");
  </script>
  <link rel="stylesheet" href="/app/styles.css" />
  <script type="module" src="/app/client.js"></script>
`;

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    ${raw(head({ meta }))}
  </head>
  <body>
    <a class="skip-link" href="#dashboard-panel">Skip to dashboard</a>
    ${raw(body)}
  </body>
</html>`;
