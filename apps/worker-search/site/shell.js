import { html, raw } from "@nativefragments/core/server";

const criticalStyles = `
  :root {
    color-scheme: light;
    --bg: #f4f1e8;
    --ink: #1a1813;
    --muted: #6b6453;
    --line: #e6e0d2;
    --line-strong: #d9d3c4;
    --surface: #fbf9f3;
    --accent: #b14d1f;
    --serif: ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
    --sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
    font-family: var(--sans);
    background: var(--bg);
    color: var(--ink);
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

  ::selection {
    background: #1a1813;
    color: #f4f1e8;
  }

  .site-shell {
    display: flex;
    flex-direction: column;
    min-height: 100svh;
  }

  .site-header {
    align-items: baseline;
    border-bottom: 1px solid var(--line-strong);
    display: flex;
    gap: 16px;
    justify-content: space-between;
    padding: 14px clamp(18px, 4vw, 48px);
  }

  .brand {
    align-items: baseline;
    display: flex;
    gap: 9px;
    font-family: var(--mono);
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .brand .dot {
    background: var(--accent);
    border-radius: 50%;
    height: 7px;
    width: 7px;
    align-self: center;
  }

  .brand .sep {
    color: var(--line-strong);
  }

  .brand .app {
    color: var(--muted);
  }

  .site-header > span {
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  main {
    flex: 1;
    padding: clamp(22px, 3.5vw, 40px) clamp(18px, 4vw, 48px) clamp(40px, 6vw, 72px);
  }

  .hero {
    align-items: end;
    border-bottom: 1px solid var(--line-strong);
    display: grid;
    gap: 14px clamp(24px, 5vw, 64px);
    grid-template-columns: minmax(0, 1fr) auto;
    margin: 0 auto clamp(20px, 3vw, 32px);
    max-width: 1180px;
    padding-bottom: clamp(18px, 2.5vw, 26px);
  }

  .eyebrow {
    color: var(--accent);
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    margin: 0 0 10px;
    text-transform: uppercase;
  }

  h1 {
    font-family: var(--serif);
    font-size: clamp(1.9rem, 4.2vw, 3.1rem);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.02;
    margin: 0;
    max-width: 16ch;
  }

  .hero p {
    color: var(--muted);
    font-size: 0.98rem;
    line-height: 1.5;
    margin: 12px 0 0;
    max-width: 62ch;
  }

  .hero-meta {
    align-items: baseline;
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: right;
  }

  .hero-meta .figure {
    font-family: var(--mono);
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .hero-meta .figure-label {
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  @media (max-width: 760px) {
    .hero {
      align-items: start;
      grid-template-columns: 1fr;
    }

    .hero-meta {
      align-items: baseline;
      flex-direction: row;
      gap: 8px;
      text-align: left;
    }

    .hero-meta .figure {
      font-size: 1.5rem;
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
        <a class="brand" href="/">
          <span class="dot" aria-hidden="true"></span>
          Native Fragments
          <span class="sep">/</span>
          <span class="app">Worker Search</span>
        </a>
        <span>Cloudflare Worker · Web Worker RPC</span>
      </header>
      <main id="content-slot">${raw(body)}</main>
    </div>
  </body>
</html>`;
