import { html, raw } from "@nativefragments/core/server";
import { createCounterState } from "../models/counter.js";
import { signalCounterElement } from "../templates/signal-counter.js";

export const homePage = () => {
  const counter = createCounterState();

  return html`<div class="page">
    <header class="masthead" aria-labelledby="page-title">
      <p class="eyebrow">Signal Counter</p>
      <h1 id="page-title">A reactive instrument<span> wired straight to the DOM.</span></h1>
      <p class="lede">
        Server-rendered Shadow DOM hydrated by a custom element. Tiny signals
        bind a value, its derived readings, and a history feed to the panel —
        no virtual DOM, no compiler, no client render pass.
      </p>
      <dl class="facts" aria-label="Demo constraints">
        <div>
          <dt>Runtime</dt>
          <dd>Cloudflare Worker</dd>
        </div>
        <div>
          <dt>UI</dt>
          <dd>Custom Element</dd>
        </div>
        <div>
          <dt>Build</dt>
          <dd>None</dd>
        </div>
      </dl>
    </header>

    <section class="demo-stage" aria-label="Interactive signal counter demo">
      ${raw(signalCounterElement(counter))}
    </section>

    <section class="notes" aria-label="Implementation notes">
      <article>
        <h2>What it demonstrates</h2>
        <p>
          A click updates one small signal store. The value, its
          <em>doubled</em>, <em>parity</em> and <em>distance</em> derivations,
          the gauge, button states and the history feed all recompute and patch
          their own nodes — only the parts that changed.
        </p>
      </article>
      <article>
        <h2>Hydration path</h2>
        <p>
          The Worker emits the element with declarative Shadow DOM. In the
          browser, the Native Fragments helper adopts that exact shadow root,
          then attaches listeners and subscriptions — so first paint and
          interactive markup are identical.
        </p>
      </article>
    </section>
  </div>`;
};
