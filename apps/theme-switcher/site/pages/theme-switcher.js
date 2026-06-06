import { themeSwitcher } from "../components/theme-switcher.js";
import { themeSwitcherPageTemplate } from "../templates/theme-switcher-page.js";

export const themeSwitcherPage = () =>
  themeSwitcherPageTemplate({
    switcher: themeSwitcher(),
  });
