import { html } from "@nativefragments/core/server";
import { createCounterState } from "../models/counter.js";
import { litCounterElement } from "../templates/signal-counter.js";

export const homePage = async () => {
  const counter = createCounterState();

  return html`<div class="page">
    <header class="masthead" aria-labelledby="page-title">
      <p class="eyebrow">Lit Counter</p>
      <h1 id="page-title">A reactive instrument<span> streamed as explicit HTML.</span></h1>
      <p class="lede">
        Lit renders the custom element on the Worker and hydrates the same
        shadow root in the browser. No framework compiler is involved.
      </p>
      <dl class="facts" aria-label="Demo constraints">
        <div>
          <dt>Runtime</dt>
          <dd>Cloudflare Worker</dd>
        </div>
        <div>
          <dt>UI</dt>
          <dd>Lit element</dd>
        </div>
        <div>
          <dt>Build</dt>
          <dd>esbuild</dd>
        </div>
      </dl>
    </header>

    <section class="demo-stage" aria-label="Interactive signal counter demo">
      ${await litCounterElement(counter)}
    </section>

    <section class="notes" aria-label="Implementation notes">
      <article>
        <h2>What it demonstrates</h2>
        <p>
          A click updates one small component state. The value, its
          <em>doubled</em>, <em>parity</em> and <em>distance</em> derivations,
          the gauge, button states and the history feed all recompute and patch
          together through Lit's declarative render cycle.
        </p>
      </article>
      <article>
        <h2>Hydration path</h2>
        <p>
          The Worker emits Lit's hydratable declarative Shadow DOM. The browser
          resumes that exact tree and attaches listeners without replacing the
          server-rendered first paint.
        </p>
      </article>
    </section>
  </div>`;
};
