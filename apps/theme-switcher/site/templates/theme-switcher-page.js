import { html, raw } from "@nativefragments/core/server";

export const themeSwitcherPageTemplate = ({ switcher }) => html`
  <section class="app-shell" aria-labelledby="page-title">
    <header class="masthead">
      <div class="hero-copy">
        <p class="eyebrow">Native Fragments &middot; Design tokens</p>
        <h1 id="page-title">One token set,<br />two DOM worlds.</h1>
        <p class="lede">
          Pick a theme below. The light&nbsp;DOM page, the server-rendered
          Shadow&nbsp;DOM controls, and the live preview all recolour from a
          single set of CSS custom properties.
        </p>
      </div>

      <aside class="token-proof" aria-label="Light DOM token preview">
        <span class="proof-label">Light DOM surface</span>
        <code class="proof-token">var(--app-surface)</code>
        <p>
          This panel sits outside the custom element, yet shares the same root
          tokens as the Shadow&nbsp;DOM preview.
        </p>
      </aside>
    </header>

    ${raw(switcher)}
  </section>
`;
