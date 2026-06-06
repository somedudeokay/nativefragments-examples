import { html, raw } from "@nativefragments/core/server";

export const themeSwitcherPageTemplate = ({ switcher }) => html`
  <section class="app-shell" aria-labelledby="page-title">
    <div class="hero-copy">
      <p class="eyebrow">Native Fragments demo</p>
      <h1 id="page-title">One set of CSS tokens, two DOM worlds.</h1>
      <p>
        Change the theme and the light DOM page, server-rendered Shadow DOM
        controls, and preview components all move together through shared custom
        properties.
      </p>
    </div>

    <aside class="token-proof" aria-label="Light DOM token preview">
      <span>Light DOM surface</span>
      <strong>var(--app-surface)</strong>
      <p>
        This panel is not inside the custom element. It uses the same root
        tokens as the Shadow DOM component below.
      </p>
    </aside>

    ${raw(switcher)}
  </section>
`;
