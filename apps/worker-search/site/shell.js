import { html, raw } from "@nativefragments/core/server";

const criticalStyles = `
  :root {
    color-scheme: light;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
    background: #f7f5ef;
    color: #161615;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
  }

  a {
    color: inherit;
  }

  .site-shell {
    min-height: 100svh;
  }

  .site-header {
    align-items: center;
    border-bottom: 1px solid rgba(22, 22, 21, 0.12);
    display: flex;
    justify-content: space-between;
    padding: 18px clamp(18px, 4vw, 56px);
  }

  .brand {
    font-size: 0.84rem;
    font-weight: 780;
    letter-spacing: 0;
    text-decoration: none;
  }

  .site-header span {
    color: #69645b;
    font-size: 0.78rem;
  }

  main {
    padding: clamp(26px, 5vw, 72px) clamp(18px, 4vw, 56px) 64px;
  }

  .hero {
    display: grid;
    gap: 16px;
    margin: 0 auto clamp(28px, 4vw, 48px);
    max-width: 1120px;
  }

  .eyebrow {
    color: #6f3d16;
    font-size: 0.78rem;
    font-weight: 760;
    margin: 0;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 6.4rem);
    letter-spacing: 0;
    line-height: 0.9;
    margin: 0;
    max-width: 980px;
  }

  .hero p:last-child {
    color: #504c44;
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.55;
    margin: 0;
    max-width: 720px;
  }

  @media (max-width: 720px) {
    .site-header {
      align-items: flex-start;
      gap: 8px;
      flex-direction: column;
    }

    main {
      padding-top: 30px;
    }
  }
`;

const headLinks = ({ meta }) => html`
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  <script>
    document.documentElement.classList.add("js");
  </script>
  <style>${raw(criticalStyles)}</style>
  <link
    rel="preload"
    href="/app/styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript><link rel="stylesheet" href="/app/styles.css" /></noscript>
  <script type="module" src="/app/client.js"></script>
`;

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    ${raw(headLinks({ meta }))}
  </head>
  <body>
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="/">Native Fragments / Worker Search</a>
        <span>Cloudflare Worker demo</span>
      </header>
      <main id="content-slot">${raw(body)}</main>
    </div>
  </body>
</html>`;
