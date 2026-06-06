import { declarativeShadow, html } from "@nativefragments/core/server";
import { DEFAULT_THEME, THEMES } from "../../public/app/theme-model.js";
import {
  themeSwitcherHtml,
  themeSwitcherStyles,
} from "../../public/app/components/theme-switcher-template.js";

export const themeSwitcher = () => html`<theme-switcher
  data-default-theme="${DEFAULT_THEME}"
>
  ${declarativeShadow({
    styles: [themeSwitcherStyles],
    html: themeSwitcherHtml({
      selectedTheme: DEFAULT_THEME,
      themes: THEMES,
    }),
  })}
</theme-switcher>`;
