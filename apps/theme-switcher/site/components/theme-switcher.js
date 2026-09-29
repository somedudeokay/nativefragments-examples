import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/theme-switcher.js";
import { DEFAULT_THEME } from "../../client/theme-model.js";

export const themeSwitcher = () =>
  renderLit(html`<theme-switcher data-default-theme=${DEFAULT_THEME}></theme-switcher>`);
