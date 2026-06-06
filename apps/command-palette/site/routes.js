import { declarativeShadow, html, route } from "@nativefragments/core/server";
import {
  paletteHtml,
  paletteStyles,
} from "../public/app/components/command-palette-template.js";

const origin = "https://command-palette.nativefragments.org";

const homePage = () => html`<section class="hero">
  <div>
    <p class="eyebrow">Command Palette</p>
    <h1>Keyboard UI in one custom element.</h1>
  </div>
  <p>
    The palette is server-rendered with Declarative Shadow DOM, then hydrated by
    a small browser module using platform events.
  </p>
</section>

<section class="surface">
  <command-palette>${declarativeShadow({
    styles: [paletteStyles],
    html: paletteHtml(),
  })}</command-palette>
  <article>
    <h2>Try the platform path.</h2>
    <p>
      Press <kbd>/</kbd> to focus the search field, type to filter commands,
      and use arrow keys to move the active row.
    </p>
  </article>
</section>`;

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description:
        "A Native Fragments command palette demo using one server-rendered Shadow DOM custom element.",
      title: "Command Palette · Native Fragments Demo",
    }),
    render: homePage,
  }),
];
