import { html, raw } from "@nativefragments/core/server";
import { createCounterState } from "../models/counter.js";
import { signalCounterElement } from "../templates/signal-counter.js";

export const homePage = () => {
  const counter = createCounterState();

  return html`<section class="app-shell" aria-labelledby="page-title">
    <div class="intro">
      <p class="eyebrow">Signal Counter</p>
      <h1 id="page-title">Reactive DOM bindings, no build step.</h1>
      <p class="lede">
        This demo starts as server-rendered HTML, then a custom element hydrates
        the existing Shadow DOM and binds tiny signals directly to the DOM.
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
    </div>

    <div class="demo-stage" aria-label="Interactive signal counter demo">
      ${raw(signalCounterElement(counter))}
    </div>
  </section>

  <section class="notes" aria-label="Implementation notes">
    <article>
      <h2>What it demonstrates</h2>
      <p>
        Button clicks update a small signal store. Text, button disabled states,
        ARIA values, meter width, and history bars react without a virtual DOM,
        compiler, or client-side render pass.
      </p>
    </article>
    <article>
      <h2>Hydration path</h2>
      <p>
        The Worker renders the custom element with declarative Shadow DOM.
        The browser module uses the Native Fragments component helper to adopt
        that shadow root before wiring events.
      </p>
    </article>
  </section>`;
};
