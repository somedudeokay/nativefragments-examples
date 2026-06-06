import { declarativeShadow, html, raw, route } from "@nativefragments/core/server";
import {
  paletteHtml,
  paletteStyles,
} from "../public/app/components/command-palette-template.js";

const origin = "https://command-palette.nativefragments.org";

// Faux product chrome rendered behind the palette to sell the ⌘K moment.
const backdropNav = ["Overview", "Workers", "Deployments", "Logs", "Settings"];
const backdropRows = [
  ["api-gateway", "Production", "2m ago"],
  ["image-resizer", "Production", "1h ago"],
  ["auth-edge", "Preview", "5h ago"],
  ["cron-digest", "Production", "yesterday"],
];

const backdrop = () => html`<div class="stage-app" aria-hidden="true">
  <aside class="stage-rail">
    <span class="stage-mark">NF</span>
    <ul>
      ${raw(
        backdropNav
          .map(
            (item, i) =>
              `<li${i === 1 ? ' class="on"' : ""}>${item}</li>`,
          )
          .join(""),
      )}
    </ul>
  </aside>
  <div class="stage-main">
    <div class="stage-head">
      <span class="stage-crumb">Workers</span>
      <span class="stage-cta">⌘K</span>
    </div>
    <div class="stage-table">
      ${raw(
        backdropRows
          .map(
            ([name, env, when]) =>
              `<div class="stage-row"><span class="dot"></span><b>${name}</b><span class="env">${env}</span><span class="when">${when}</span></div>`,
          )
          .join(""),
      )}
    </div>
  </div>
</div>`;

const homePage = () => html`<section class="stage">
  <div class="stage-bar">
    <p class="eyebrow">Command Palette</p>
    <h1>Every action, one keystroke away.</h1>
    <p class="lede">
      A ⌘K palette built as a single custom element — server-rendered with
      Declarative Shadow DOM, then hydrated by a small browser module using
      platform keyboard events.
    </p>
  </div>

  <div class="stage-frame">
    ${raw(backdrop())}

    <div class="scrim">
      <command-palette>${declarativeShadow({
        styles: [paletteStyles],
        html: paletteHtml(),
      })}</command-palette>
      <p class="scrim-note">
        Press <kbd>/</kbd> to focus the field · type to filter · <kbd>↑</kbd>
        <kbd>↓</kbd> to move the selection.
      </p>
    </div>
  </div>
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
